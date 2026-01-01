const XLSX = require('xlsx');

const invoiceData = [
    ['FEDEX FREIGHT INVOICE'],
    [''],
    ['Invoice Number:', 'INV-2024-456789'],
    ['Invoice Date:', '2024-12-30'],
    ['Due Date:', '2025-01-30'],
    ['Customer ID:', 'CUST-GL-1234'],
    [''],
    ['Tracking Number', 'Origin', 'Destination', 'Weight (kg)', 'Service Type', 'Base Rate (EUR)', 'Fuel Surcharge', 'Total (EUR)', 'Status'],
    ['FX789456123', 'Atlanta, GA', 'Berlin, Germany', 245.5, 'Priority', 892, 156.10, 1093.10, 'Delivered'],
    ['FX789456124', 'Atlanta, GA', 'Munich, Germany', 180.2, 'Economy', 645, 112.88, 792.88, 'Delivered'],
    ['FX789456125', 'Miami, FL', 'Frankfurt, Germany', 520.8, 'Priority', 1450, 253.75, 1788.75, 'In Transit'],
    ['FX789456126', 'Chicago, IL', 'Hamburg, Germany', 95.0, 'Economy', 380, 66.50, 471.50, 'Delivered'],
    ['FX789456127', 'Los Angeles, CA', 'Düsseldorf, Germany', 1250.0, 'Freight LTL', 2890, 505.75, 3545.75, 'Pending'],
    ['FX789456128', 'New York, NY', 'Stuttgart, Germany', 78.5, 'Priority', 425, 74.38, 524.38, 'Delivered'],
    ['FX789456129', 'Seattle, WA', 'Cologne, Germany', 340.0, 'Economy', 920, 161.00, 1136.00, 'Delivered'],
    ['FX789456130', 'Boston, MA', 'Leipzig, Germany', 210.5, 'Priority', 780, 136.50, 956.50, 'Delivered'],
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(invoiceData);
XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
XLSX.writeFile(wb, './public/test-files/fedex_invoice.xlsx');
console.log('Created fedex_invoice.xlsx');
