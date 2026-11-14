import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
export async function shareTrips(csv: string): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing is unavailable on this device');
  const file=new File(Paths.cache,'mileage-trips.csv');
  file.create({overwrite:true});
  await file.write(csv);
  await Sharing.shareAsync(file.uri,{mimeType:'text/csv',dialogTitle:'Export mileage log'});
}
