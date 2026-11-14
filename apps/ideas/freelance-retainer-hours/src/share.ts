import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/** Sharing is explicitly initiated by user; the app does not send data to our servers. */
export async function shareDocument(
  basename:string,extension:'json'|'csv'|'txt',content:string,
):Promise<void>{
  if(!/^[a-z0-9-]{1,80}$/.test(basename))throw new RangeError('Invalid export filename');
  if(!(await Sharing.isAvailableAsync()))throw new Error('Sharing is not supported on this device');
  if(content.length>2_500_000)throw new RangeError('Export exceeds safe size');
  const file=new File(Paths.cache,basename+'.'+extension);
  file.create({overwrite:true});
  await file.write(content);
  await Sharing.shareAsync(file.uri,{
    mimeType:extension==='json'?'application/json':extension==='csv'?'text/csv':'text/plain',
    dialogTitle:'Share retainer hours '+extension.toUpperCase(),
  });
}
