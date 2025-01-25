const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwbANuzGGxzbGmze218B1DFb0sjqtL33ONbTVSfOPhiilrbk9FTQ9S8vLO0gLIjbOJw1w/exec';

function buildUrl(action) {
  const url = new URL(SCRIPT_URL);
  url.searchParams.append('action', action);
  return url;
}

export async function fetchBranchConfig() {
  try {
    const url = buildUrl('getBranchConfig');
    const strUrl = url.toString();
    const response = await fetch(strUrl);
    const data = await response.json();
    return data.branches.map(branch => ({
      name: branch.branchName,
    }));
  } catch (error) {
    alert('Gagal memuat data cabang. Silakan coba lagi.');
    console.error('Error fetching branch config:', error);
  }
}

export async function fetchVehicleData(branch) {
  try {
    if (!branch) {
      throw new Error('Branch parameter is required');
    }
    const url = buildUrl('getVehicleData');
    url.searchParams.append('branch', branch);
    const strUrl = url.toString();
    const response = await fetch(strUrl);
    const data = await response.json();
    return data.vehicles || [];
  } catch (error) {
    alert('Gagal memuat data kendaraan. Silakan coba lagi.');
    console.error('Error fetching vehicle data:', error);
  }
}

export async function fetchInvoiceData(branch, date) {
  try {
    if (!branch || !date) {
      throw new Error('Branch and date parameters are required');
    }
    
    // Convert date to m/d/yyyy format for the API
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    
    const url = buildUrl('getInvoiceList');
    url.searchParams.append('branch', branch);
    url.searchParams.append('date', formattedDate);
    const strUrl = url.toString();
    const response = await fetch(strUrl);
    const data = await response.json();
    
    return data.invoices.map(invoice => ({
      no: invoice.nomorInvoice,
      date: invoice.tanggalLengkap,
      store: {
        name: invoice.namaCustomer,
        address: invoice.alamatCustomer
      }
    }));
  } catch (error) {
    alert('Gagal memuat data faktur. Silakan coba lagi.');
    console.error('Error fetching invoice data:', error);
  }
}

export async function submitForm(formData) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submitForm',
        data: formData
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    alert('Gagal mengirim form. Silakan coba lagi.');
    console.error('Error submitting form:', error);
  }
}
