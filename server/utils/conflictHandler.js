export const isConflict = (clientTime, serverTime) => {
  return new Date(clientTime) < new Date(serverTime);
};