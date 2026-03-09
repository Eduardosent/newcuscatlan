import React, { useState, useEffect } from 'react';

export const MortgageCalculator = ({ initialPrice = 300000 }) => {
  // Manejamos los inputs como strings para que se puedan borrar y editar sin errores de ceros
  const [price, setPrice] = useState(initialPrice.toString());
  const [rate, setRate] = useState("7.25");
  const [downPayment, setDownPayment] = useState("20");
  const [years, setYears] = useState("25");
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    const p = parseFloat(price) || 0;
    const r = parseFloat(rate) || 0;
    const d = parseFloat(downPayment) || 0;
    const y = parseFloat(years) || 0;

    if (p > 0 && r > 0 && y > 0) {
      const loanAmount = p * (1 - d / 100);
      const monthlyRate = (r / 100) / 12;
      const totalPaymentsCount = y * 12;
      
      const factor = Math.pow(1 + monthlyRate, totalPaymentsCount);
      const calculation = (loanAmount * monthlyRate * factor) / (factor - 1);
      
      setMonthlyPayment(calculation || 0);
    } else {
      setMonthlyPayment(0);
    }
  }, [price, rate, downPayment, years]);

const handleInputChange = (
  value: string, 
  setter: (val: string) => void
): void => {
  // Solo permite strings vacíos (para borrar) o números con un solo punto decimal
  if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
    setter(value);
  }
};
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row my-10 font-sans">
      
      {/* PANEL DE INPUTS */}
      <div className="p-10 md:w-5/12 bg-gray-50/50">
        <h3 className="text-[#002855] font-black text-2xl mb-8 tracking-tight uppercase">Calculadora Hipotecaria</h3>
        
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Precio del Inmueble (USD)</label>
            <input 
              type="text" 
              value={price} 
              onChange={(e) => handleInputChange(e.target.value, setPrice)} 
              className="w-full mt-1 p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#002855] outline-none transition-all font-bold text-gray-700 shadow-sm" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tasa Anual (%)</label>
              <input 
                type="text" 
                value={rate} 
                onChange={(e) => handleInputChange(e.target.value, setRate)}
                className="w-full mt-1 p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#002855] outline-none transition-all font-bold text-gray-700 shadow-sm" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Prima (%)</label>
              <input 
                type="text" 
                value={downPayment} 
                onChange={(e) => handleInputChange(e.target.value, setDownPayment)}
                className="w-full mt-1 p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#002855] outline-none transition-all font-bold text-gray-700 shadow-sm" 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Plazo (Años)</label>
            <input 
              type="text" 
              value={years} 
              onChange={(e) => handleInputChange(e.target.value, setYears)}
              className="w-full mt-1 p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#002855] outline-none transition-all font-bold text-gray-700 shadow-sm" 
            />
          </div>
        </div>
      </div>

      {/* PANEL DE RESULTADOS */}
      <div className="bg-[#002855] md:w-7/12 p-10 flex flex-col justify-center relative">
        <div className="relative z-10">
          <span className="text-blue-200/60 text-xs font-bold tracking-[0.2em] uppercase">Pago Mensual Estimado</span>
          <h2 className="text-white text-6xl font-black mt-2 mb-8 tracking-tighter">
            ${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>

          <div className="grid grid-cols-2 gap-y-8 gap-x-12 border-t border-white/10 pt-8">
            <div className="flex flex-col">
              <span className="text-blue-300/70 text-[10px] font-bold uppercase tracking-widest">Pago inicial (Prima)</span>
              <span className="text-white text-xl font-bold mt-1">
                ${((parseFloat(price) || 0) * ((parseFloat(downPayment) || 0) / 100)).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-300/70 text-[10px] font-bold uppercase tracking-widest">A financiar</span>
              <span className="text-white text-xl font-bold mt-1">
                ${((parseFloat(price) || 0) * (1 - (parseFloat(downPayment) || 0) / 100)).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-300/70 text-[10px] font-bold uppercase tracking-widest">Cuotas totales</span>
              <span className="text-white text-xl font-bold mt-1">{(parseFloat(years) || 0) * 12} meses</span>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-300/70 text-[10px] font-bold uppercase tracking-widest">Tasa Mensual</span>
              <span className="text-white text-xl font-bold mt-1">{((parseFloat(rate) || 0) / 12).toFixed(3)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};