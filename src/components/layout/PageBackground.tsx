const PageBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[15%] -left-32 w-[600px] h-[600px] rounded-full bg-[#FF6542] opacity-[0.05] blur-[120px]"></div>
      <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[#912F40] opacity-[0.04] blur-[140px]"></div>
      <div className="absolute top-[70%] left-[20%] w-[550px] h-[550px] rounded-full bg-[#FF6542] opacity-[0.06] blur-[130px]"></div>
      <div className="absolute top-[85%] right-[15%] w-[650px] h-[650px] rounded-full bg-[#748386] opacity-[0.03] blur-[150px]"></div>
    </div>
  );
};

export default PageBackground;
