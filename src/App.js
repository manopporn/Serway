import React, { useState } from "react";
import {
  Home,
  MapPin,
  Target,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Compass,
  Ruler,
  Mountain,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

export default function App() {
  // 1 = หน้าจุดต้น, 2 = หน้าจุดปลาย, 3 = หน้าผลลัพธ์
  const [step, setStep] = useState(1);

  // เก็บค่าจุดที่ 1
  const [p1, setP1] = useState({ e: "", n: "", z: "" });
  // เก็บค่าจุดที่ 2
  const [p2, setP2] = useState({ e: "", n: "", z: "" });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ฟังก์ชันอัปเดตข้อมูลจุด
  const updateP1 = (field, value) =>
    setP1((prev) => ({ ...prev, [field]: value }));
  const updateP2 = (field, value) =>
    setP2((prev) => ({ ...prev, [field]: value }));

  // ฟังก์ชันล้างข้อมูลเฉพาะจุด
  const clearP1 = () => setP1({ e: "", n: "", z: "" });
  const clearP2 = () => setP2({ e: "", n: "", z: "" });

  // กลับไปหน้าแรกสุด (Home)
  const goHome = () => {
    setStep(1);
    setError("");
  };

  // เริ่มใหม่ทั้งหมด ล้างข้อมูล
  const handleReset = () => {
    setP1({ e: "", n: "", z: "" });
    setP2({ e: "", n: "", z: "" });
    setResult(null);
    setError("");
    setStep(1);
  };

  // ไปหน้า 2 (ตรวจสอบข้อมูลหน้า 1 ก่อน)
  const handleNextToP2 = () => {
    if (!p1.e || !p1.n || !p1.z) {
      setError("กรุณากรอกข้อมูล E, N, Z ให้ครบถ้วน");
      return;
    }
    setError("");
    setStep(2);
  };

  // คำนวณผลลัพธ์ (ตรวจสอบข้อมูลหน้า 2 ก่อนไปหน้า 3)
  const calculateResult = () => {
    if (!p2.e || !p2.n || !p2.z) {
      setError("กรุณากรอกข้อมูล E, N, Z ให้ครบถ้วน");
      return;
    }
    setError("");

    const e1 = parseFloat(p1.e);
    const n1 = parseFloat(p1.n);
    const z1 = parseFloat(p1.z);
    const e2 = parseFloat(p2.e);
    const n2 = parseFloat(p2.n);
    const z2 = parseFloat(p2.z);

    const deltaE = e2 - e1;
    const deltaN = n2 - n1;
    const deltaZ = z2 - z1;

    // ระยะราบ
    const distance2D = Math.sqrt(Math.pow(deltaE, 2) + Math.pow(deltaN, 2));
    // ระยะลาดชัน
    const distance3D = Math.sqrt(
      Math.pow(deltaE, 2) + Math.pow(deltaN, 2) + Math.pow(deltaZ, 2)
    );

    // มุมภาคทิศ
    let azimuthRadians = Math.atan2(deltaE, deltaN);
    let azimuthDegrees = azimuthRadians * (180 / Math.PI);
    if (azimuthDegrees < 0) {
      azimuthDegrees += 360;
    }

    // แปลงรูปแบบ องศา ลิปดา ฟิลิปดา (DMS)
    const d = Math.floor(azimuthDegrees);
    const minFloat = (azimuthDegrees - d) * 60;
    const m = Math.floor(minFloat);
    const s = ((minFloat - m) * 60).toFixed(2);

    // แปลงเป็นมิลเลียม
    const azimuthMils = azimuthDegrees * (6400 / 360);

    setResult({
      distance2D: distance2D.toFixed(3),
      distance3D: distance3D.toFixed(3),
      deltaZ: Math.abs(deltaZ).toFixed(3),
      isElevationUp: deltaZ >= 0,
      azimuthMils: Math.round(azimuthMils),
      azimuthMilsDecimal: azimuthMils.toFixed(2),
      azimuthDeg: azimuthDegrees.toFixed(4),
      azimuthDMS: `${d}° ${m}' ${s}"`,
      deltaE: deltaE.toFixed(3),
      deltaN: deltaN.toFixed(3),
    });

    setStep(3);
  };

  return (
    // คอนเทนเนอร์หลัก บังคับความกว้างให้เหมือนหน้าจอมือถือตรงกลางจอ
    <div className="min-h-screen bg-slate-100 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        {/* === Header (แถบบนสุด) === */}
        <header className="sticky top-0 z-20 bg-blue-600 text-white px-4 py-4 flex items-center justify-between shadow-md">
          <button
            onClick={goHome}
            className="p-2 -ml-2 rounded-full hover:bg-blue-700 active:bg-blue-800 transition-colors"
            aria-label="Home"
          >
            <Home size={24} />
          </button>
          <h1 className="text-lg font-bold">UTM Calculator</h1>
          <button
            onClick={handleReset}
            className="p-2 -mr-2 rounded-full hover:bg-blue-700 active:bg-blue-800 transition-colors"
            aria-label="Reset All"
          >
            <RotateCcw size={24} />
          </button>
        </header>

        {/* === Progress Indicator === */}
        <div className="bg-slate-50 flex justify-center py-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                step >= 1 ? "bg-blue-600" : "bg-slate-300"
              }`}
            ></div>
            <div
              className={`w-8 h-1 rounded-full ${
                step >= 2 ? "bg-blue-600" : "bg-slate-300"
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full ${
                step >= 2 ? "bg-blue-600" : "bg-slate-300"
              }`}
            ></div>
            <div
              className={`w-8 h-1 rounded-full ${
                step >= 3 ? "bg-blue-600" : "bg-slate-300"
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full ${
                step === 3 ? "bg-blue-600" : "bg-slate-300"
              }`}
            ></div>
          </div>
        </div>

        {/* === Content Area (พื้นที่เลื่อนได้) === */}
        <main className="flex-1 overflow-y-auto p-5 pb-24">
          {/* แสดงแจ้งเตือนข้อผิดพลาด */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 p-3 rounded-xl flex items-start text-red-600 text-sm">
              <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ----- หน้า 1: จุดต้น ----- */}
          {step === 1 && (
            <div className="animate-in slide-in-from-left duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-600">
                  <MapPin size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    จุดที่ 1
                  </h2>
                  <p className="text-slate-500">กรอกพิกัดจุดเริ่มต้น</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Easting (X)
                  </label>
                  <input
                    type="number"
                    value={p1.e}
                    onChange={(e) => updateP1("e", e.target.value)}
                    placeholder="เช่น 683500"
                    className="w-full h-14 px-4 text-lg bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Northing (Y)
                  </label>
                  <input
                    type="number"
                    value={p1.n}
                    onChange={(e) => updateP1("n", e.target.value)}
                    placeholder="เช่น 1530200"
                    className="w-full h-14 px-4 text-lg bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Elevation (Z)
                  </label>
                  <input
                    type="number"
                    value={p1.z}
                    onChange={(e) => updateP1("z", e.target.value)}
                    placeholder="ชั้นความสูง เช่น 15"
                    className="w-full h-14 px-4 text-lg bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* ปุ่มล้างข้อมูลจุดที่ 1 */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={clearP1}
                  className="flex items-center text-slate-500 hover:text-slate-700 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-sm"
                >
                  <RotateCcw size={18} className="mr-2" />
                  ล้างข้อมูลจุดต้น
                </button>
              </div>
            </div>
          )}

          {/* ----- หน้า 2: จุดปลาย ----- */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-emerald-100 p-3 rounded-full mr-4 text-emerald-600">
                  <Target size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    จุดที่ 2
                  </h2>
                  <p className="text-slate-500">กรอกพิกัดจุดปลายทาง</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Easting (X)
                  </label>
                  <input
                    type="number"
                    value={p2.e}
                    onChange={(e) => updateP2("e", e.target.value)}
                    placeholder="เช่น 684200"
                    className="w-full h-14 px-4 text-lg bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Northing (Y)
                  </label>
                  <input
                    type="number"
                    value={p2.n}
                    onChange={(e) => updateP2("n", e.target.value)}
                    placeholder="เช่น 1531500"
                    className="w-full h-14 px-4 text-lg bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Elevation (Z)
                  </label>
                  <input
                    type="number"
                    value={p2.z}
                    onChange={(e) => updateP2("z", e.target.value)}
                    placeholder="ชั้นความสูง เช่น 120"
                    className="w-full h-14 px-4 text-lg bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* ปุ่มล้างข้อมูลจุดที่ 2 */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={clearP2}
                  className="flex items-center text-slate-500 hover:text-slate-700 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-sm"
                >
                  <RotateCcw size={18} className="mr-2" />
                  ล้างข้อมูลจุดปลาย
                </button>
              </div>
            </div>
          )}

          {/* ----- หน้า 3: ผลลัพธ์ ----- */}
          {step === 3 && result && (
            <div className="animate-in slide-in-from-bottom duration-500 space-y-4">
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
                ผลการคำนวณ
              </h2>

              {/* การ์ดมุมภาคทิศ */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-amber-100">
                    มุมภาคทิศ (Azimuth)
                  </span>
                  <Compass size={24} className="text-amber-200" />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black">
                    {result.azimuthMils}
                  </span>
                  <span className="text-xl font-medium pb-1">มิลเลียม</span>
                </div>
                <div className="mt-4 text-sm text-amber-100 bg-amber-800/20 p-3 rounded-xl backdrop-blur-sm space-y-1">
                  <div className="flex justify-between items-center">
                    <span>แบบองศา (DMS):</span>
                    <span className="font-semibold text-white">
                      {result.azimuthDMS}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>แบบทศนิยม:</span>
                    <span className="font-semibold text-white">
                      {result.azimuthDeg}°
                    </span>
                  </div>
                </div>
              </div>

              {/* การ์ดระยะราบ */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-slate-600">
                    ระยะราบ (2D)
                  </span>
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Ruler size={20} />
                  </div>
                </div>
                <div className="flex items-end gap-2 text-slate-800">
                  <span className="text-4xl font-bold">
                    {Number(result.distance2D).toLocaleString("en-US", {
                      minimumFractionDigits: 3,
                    })}
                  </span>
                  <span className="text-lg font-medium pb-1">เมตร</span>
                </div>
              </div>

              {/* การ์ดระยะลาดชัน */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-slate-600">
                    ระยะลาดชัน (3D)
                  </span>
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <Mountain size={20} />
                  </div>
                </div>
                <div className="flex items-end gap-2 text-slate-800 mb-3">
                  <span className="text-4xl font-bold">
                    {Number(result.distance3D).toLocaleString("en-US", {
                      minimumFractionDigits: 3,
                    })}
                  </span>
                  <span className="text-lg font-medium pb-1">เมตร</span>
                </div>
                <div className="flex items-center text-sm font-medium">
                  <span className="text-slate-500 mr-2">
                    ความต่างระดับ (ΔZ):
                  </span>
                  <span
                    className={
                      result.isElevationUp
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }
                  >
                    {result.isElevationUp ? "ขึ้น " : "ลง "} {result.deltaZ} ม.
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* === Bottom Action Bar (แถบปุ่มกดด้านล่าง ฟิกซ์ไว้) === */}
        <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 p-4 pb-6">
          {step === 1 && (
            <button
              onClick={handleNextToP2}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-lg flex items-center justify-center transition-colors shadow-md"
            >
              ถัดไป (จุดปลาย)
              <ArrowRight className="ml-2" size={20} />
            </button>
          )}

          {step === 2 && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={calculateResult}
                className="w-2/3 h-14 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-lg flex items-center justify-center transition-colors shadow-md"
              >
                <Calculator className="mr-2" size={20} />
                คำนวณ
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/2 h-14 border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-lg flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="mr-2" size={20} />
                แก้ไขข้อมูล
              </button>
              <button
                onClick={handleReset}
                className="w-1/2 h-14 bg-slate-800 text-white rounded-xl font-bold text-lg flex items-center justify-center transition-colors shadow-md"
              >
                <RotateCcw className="mr-2" size={20} />
                เริ่มใหม่
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
