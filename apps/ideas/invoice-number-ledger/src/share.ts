import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
/** Manual share-sheet export only, with no background upload or account. */
export async function shareDocument(name:string,ext:'csv'|'json',body:string):Promise<void>{
  if(!/^[a-z0-9-]{1,80}$/.test(name))throw new RangeError('Unsafe export filename');
  if(body.length>2_500_000)throw new RangeError('Export is too large');
  if(!(await Sharing.isAvailableAsync()))throw new Error('Sharing is unavailable on this device');
  const file=new File(Paths.cache,name+'.'+ext);
  file.create({overwrite:true});
  await file.write(body);
  await Sharing.shareAsync(file.uri,{
    mimeType:ext==='csv'?'text/csv':'application/json',
    dialogTitle:'Export invoice reference '+ext.toUpperCase(),
  });
}
