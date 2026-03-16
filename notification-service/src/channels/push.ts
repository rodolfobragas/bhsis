export const sendPush = async (deviceId: string, message: string) => {
  console.log(`Push -> ${deviceId}: ${message}`);
  // integrate with Firebase / OneSignal later
};
