import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/** Export is user initiated; no data is transmitted without choosing a destination. */
export async function shareText(slug:string,extension:'csv'|'json',content:string):Promise<void>{
  if(!(await Sharing.isAvailableAsync()))throw new Error('File sharing is unavailable on this device');
  if(!/^[a-z0-9-]+$/.test(slug))throw new RangeError('Invalid export name');
  const file=new File(Paths.cache,slug+'-backup.'+extension);
  file.create({overwrite:true});
  await file.write(content);
  await Sharing.shareAsync(file.uri,{
    mimeType:extension==='csv'?'text/csv':'application/json',
    dialogTitle:'Export '+slug,
  });
}
