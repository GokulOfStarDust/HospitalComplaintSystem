import axiosInstance from './api/axiosInstance';

const handleQRCodePrint = (roomQR) => {
    const selectedQRs = roomQR.filter(item => item?.toPrint);
    if (selectedQRs.length === 0) {
      alert('Please select at least one room to print QR codes.');
      return;
    }

    const printContent = `<!DOCTYPE html>
    <html>
    <head>
    <title>Room QR Codes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
        body { -webkit-print-color-adjust: exact; }
        .page {
            page-break-after: always;
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
        }
        .page:last-child { page-break-after: avoid; }
        }
        @page { size: A4; margin: 0; }
    </style>
    </head>
    <body class="bg-white text-gray-800 font-sans">
    ${selectedQRs.map((qrItem) => `
        <div class="page flex flex-col justify-center items-center bg-gradient-to-br from-teal-500 to-teal-700 w-screen h-screen relative">
        <div class="header mb-8 text-center">
            <h1 class="text-4xl font-extrabold text-white drop-shadow-md mb-4">Room Ticket QR Code</h1>
            <p class="text-lg text-white/90 font-normal mb-10">To Create any tickets or rise any issues scan this QR code</p>
        </div>
        <div class="qr-card bg-white rounded-2xl p-10 shadow-lg max-w-xl w-11/12 border-4 border-gray-200 text-center">
            <div class="qr-container bg-white rounded-xl p-5 mb-6 shadow-inner">
            <img src="${qrItem.qrCodeUrl}" alt="QR Code" class="w-72 h-72 max-w-full rounded-lg mx-auto" />
            </div>
        </div>
        </div>
    `).join('')}
    </body>
    </html>`;

    // Create blob and open as URL
    const blob = new Blob([printContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank', 'width=800,height=600');
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        URL.revokeObjectURL(url); // Clean up
      }, 1000);
    };
  };

export const QRCodePrinter = ({ roomQR }) => {
    return (
        <button 
            onClick={()=>{handleQRCodePrint(roomQR)}}
            className='w-[10vw] bg-[#04B7B1] text-white rounded-md hover:bg-[#03A6A0] transition duration-300 ease-in-out p-2 m-4'
        >
            Print QR Code
        </button>
    );
};

export default handleQRCodePrint;