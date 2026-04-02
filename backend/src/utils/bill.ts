import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export const generateBillNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `BILL-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${timestamp}-${random}`;
};

export const generateQRCode = async (billNumber: string, orderId: string): Promise<string> => {
  try {
    const data = JSON.stringify({
      bill_number: billNumber,
      order_id: orderId,
      timestamp: new Date().toISOString(),
      hash: uuidv4(),
    });
    
    const qrCode = await QRCode.toDataURL(data);
    return qrCode;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const generateWhatsAppMessage = (billNumber: string, totalPrice: number, items: any[]): string => {
  let message = `*YOKINA CAFE*\n\n`;
  message += `📄 Bill: ${billNumber}\n`;
  message += `📅 ${new Date().toLocaleString('id-ID')}\n\n`;
  message += `*Items:*\n`;
  
  items.forEach((item: any) => {
    message += `• ${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
  });
  
  message += `\n*Total: Rp ${totalPrice.toLocaleString('id-ID')}*\n`;
  message += `\nTerima kasih! 🙏`;
  
  return message;
};
