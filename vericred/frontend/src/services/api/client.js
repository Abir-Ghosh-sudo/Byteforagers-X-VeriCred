import { env } from "../../config/environment";
export async function api(path, options={}){ const res=await fetch(`${env.apiUrl}${path}`,{headers:{"Content-Type":"application/json",...(options.headers||{})},...options}); let data=null; try{data=await res.json()}catch{} if(!res.ok) throw new Error(data?.detail || data?.message || `Request failed (${res.status})`); return data; }
