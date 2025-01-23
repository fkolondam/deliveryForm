const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwbANuzGGxzbGmze218B1DFb0sjqtL33ONbTVSfOPhiilrbk9FTQ9S8vLO0gLIjbOJw1w/exec';

function buildUrl(action) {
  const url = new URL(SCRIPT_URL);
  url.searchParams.append('action', action);
  return url.toString();
}

export async function fetchBranchConfig() {
  try {
    const url = buildUrl('getBranchConfig');
    console.log('Fetching branch config from:', url); // Debug log
    const response = await fetch(url);
    const data = await response.json();
    console.log('Branch config response:', data); // Debug log
    return data.branches.map(branch => ({
      name: branch.branchName,
    }));
  } catch (error) {
    console.error('Error fetching branch config:', error);
    throw error;
  }
}

// New function to fetch vehicle data based on selected branch
export async function fetchVehicleData(branch) {
  try {
    console.log('Branch parameter received:', branch); // Debug log
    const url = buildUrl('getVehicleData');
    url.searchParams.append('branch', branch);
    console.log('Fetching vehicle data from:', url); // Debug log
    const response = await fetch(url);
    const data = await response.json();
    console.log('Vehicle data response:', data); // Debug log
    return data.vehicles; // Assuming the response contains a vehicles array
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    throw error;
  }
}

// New function to fetch invoice data based on selected branch and date
export async function fetchInvoiceData(branch, date) {
  try {
    const url = buildUrl('getInvoiceList');
    url.searchParams.append('branch', branch);
    url.searchParams.append('date', date);
    console.log('Fetching invoice data from:', url); // Debug log
    const response = await fetch(url);
    const data = await response.json();
    console.log('Invoice data response:', data); // Debug log
    return data.invoices.map(invoice => ({
      no: invoice.nomorInvoice,
      date: invoice.tanggalLengkap,
      amount: 0, // Add amount handling if needed
      store: {
        name: invoice.namaCustomer,
        address: invoice.alamatCustomer
      }
    }));
  } catch (error) {
    console.error('Error fetching invoice list:', error);
    throw error;
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
    console.error('Error submitting form:', error);
    throw error;
  }
}
