import { serve } from "bun";
import { fromBase64, fromBuffer, fromPath } from "pdf2pic";
import { PDFDocument } from 'pdf-lib';



const PORT = 8080;

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/pdf" && req.method === "POST") {
      try{
        let buffer = await getsupabasefile();
        if(buffer){
         const pages: number =  await splitPdf(buffer);
         for (let i=0; i<pages; i++){
          await pdf2img(buffer,i+1);
         }
        }
        return new Response("Success");
      }catch(error){
        return new Response("Error");
      }
    }
    
    return new Response("404!");
  },
});

console.log(`Listening on http://localhost:${PORT} ...`);

async function pdf2img(buffer: Buffer, pagenumber: number){
  try {
  
    const convert = fromBuffer(buffer);
    
    convert(pagenumber, { responseType: "base64" })
      .then((base64) => {
        console.log(`Page ${pagenumber} is now converted as image`);
    
        return;
      });
  }catch(error){
    console.error(`Error converting page ${pagenumber}:`, error);
      throw new Error(`Error converting page ${pagenumber}: ${(error as Error).message}`);
  }
  }
  
  async function getsupabasefile(){
    const fileurl = "https://borfnczrxdwlfilewkfj.supabase.co/storage/v1/object/sign/test/Interviews/testpdf.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0L0ludGVydmlld3MvdGVzdHBkZi5wZGYiLCJpYXQiOjE3Mjk4ODkxMDUsImV4cCI6MTczMDQ5MzkwNX0.AcdpiSm9XAuKw6xdasxa5h8rzY_uwT0B1BzbqrM7Tig&t=2024-10-25T20%3A45%3A05.488Z";
    try {
      const response = await fetch(fileurl, {
        method: 'GET',
        headers: {
        }
      });
  
      if (!response.ok) {
        console.error('Failed to fetch the file:', response.statusText);
        return null;
      }
  
      const buffer = Buffer.from(await response.arrayBuffer());
      console.log('File fetched successfully');
      return buffer;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  
  
  async function splitPdf(buffer: Buffer): Promise<number> {
    try {
      const uint8Array = new Uint8Array(buffer);
      const originalPdf = await PDFDocument.load(uint8Array);
    const numPages = originalPdf.getPageCount();
    
    return numPages;
    }catch(error){
      throw new Error((error as Error).message);
    }
  }
