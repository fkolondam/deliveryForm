# Proposed Modifications for Google Apps Script Endpoint

## Overview
This document outlines the proposed changes to the Google Apps Script endpoint to support new query filtering requirements for the delivery form application.

## Modifications

### 1. Add a New Action for Vehicle Data
Implement a new function `getVehicleData` that retrieves vehicle data based on the selected branch.

```javascript
function getVehicleData(branch) {
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getSheetByName('Vehicles');
  const data = sheet.getDataRange().getValues();
  const vehicles = data.filter(row => row[0] === branch).map(row => ({
    vehicleName: row[1],
    // Add other vehicle properties as needed
  }));
  
  return ContentService.createTextOutput(JSON.stringify({ vehicles })).setMimeType(ContentService.MimeType.JSON);
}
```

### 2. Modify the Existing Invoice List Action
Update the `getInvoiceList` function to accept `branch` and `date` parameters for filtering.

```javascript
function getInvoiceList(branch, date) {
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getSheetByName('Invoices');
  const data = sheet.getDataRange().getValues();
  const invoices = data.filter(row => row[1] === branch && row[2] === date).map(row => ({
    nomorInvoice: row[0],
    tanggalLengkap: row[2],
    namaCustomer: row[3],
    alamatCustomer: row[4],
    // Add other invoice properties as needed
  }));
  
  return ContentService.createTextOutput(JSON.stringify({ invoices })).setMimeType(ContentService.MimeType.JSON);
}
```

## Next Steps
1. Implement the proposed changes in the Google Apps Script.
2. Test the new functionality to ensure that the fetching of vehicle data and invoice data works as expected based on the selected branch and date.
