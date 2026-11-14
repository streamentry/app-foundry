import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/** User-directed export only: no automatic remote uploads. */
export async function shareDocument(name:string,extension:'csv'|'json',content:string):Promise<void>{
  if(!/^[a-z0-9-]{1,80}$/.test(name))throw new RangeError('Invalid filename');
  if(!(await Sharing.isAvailableAsync()))throw new Error('Sharing is unavailable on this device');
  const file=new File(Paths.cache,name+'.'+extension);
  file.create({overwrite:true});
  await file.write(content);
  await Sharing.shareAsync(file.uri,{
    mimeType:extension==='csv'?'text/csv':'application/json',
    dialogTitle:'Export Cash Close '+extension.toUpperCase(),
  });
}
