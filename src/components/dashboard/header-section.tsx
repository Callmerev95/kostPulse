interface HeaderSectionProps {
  userName: string;
}

export function HeaderSection({ userName }: HeaderSectionProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white">
          Ringkasan <span className="text-[#D4AF37]">Bisnis</span>
        </h1>
        <p className="text-white/40 text-sm font-medium mt-1">
          Selamat datang kembali, {userName}. Berikut performa KostFlow Anda.
        </p>
      </div>
      <div className="bg-white/3 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3 backdrop-blur-md self-start md:self-center">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </div>
        <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">
          Engine Active
        </span>
      </div>
    </div>
  );
}