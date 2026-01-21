import '@/styles/pdf.css';

export default function PdfContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-black m-0 p-0">
      {children}
    </div>
  );
}
