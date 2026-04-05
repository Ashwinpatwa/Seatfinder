import React, { useState, useMemo } from 'react';
import { Search, MapPin, Calendar, Clock, GraduationCap, Building2, User, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEATING_DATA, CONSOLIDATED_ROOMS } from './data';
import { StudentSeat } from './types';

const ROOM_LAYOUTS: Record<string, { columns: number; rowsPerColumn: number[] }> = {
  'FR-1': {
    columns: 5,
    rowsPerColumn: [5, 5, 5, 5, 5]
  },
  'FR-2': {
    columns: 2,
    rowsPerColumn: [9, 8]
  },
  'FR-19': {
    columns: 6,
    rowsPerColumn: [13, 13, 13, 13, 13, 12]
  }
};

function SeatMap({ result }: { result: StudentSeat }) {
  const layout = ROOM_LAYOUTS[result.room];
  if (!layout) return null;

  let currentStart = 1;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100 overflow-x-auto">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Info size={20} className="text-indigo-500" />
        Room {result.room} Layout Guide
      </h3>
      <div className="flex gap-6 min-w-max pb-4">
        {layout.rowsPerColumn.map((rowCount, colIdx) => {
          const start = currentStart;
          currentStart += rowCount;

          return (
            <div key={colIdx} className="space-y-2">
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase mb-2">Column-{colIdx + 1}</p>
              {[...Array(rowCount)].map((_, i) => {
                const seatNum = start + i;
                const seatA = `A${seatNum}`;
                const seatB = `B${seatNum}`;
                const isMySeatA = result.seat === seatA;
                const isMySeatB = result.seat === seatB;

                return (
                  <div key={i} className="flex gap-1">
                    <div className={`w-10 h-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${isMySeatA ? 'bg-indigo-600 text-white scale-110 shadow-lg ring-2 ring-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                      {seatA}
                    </div>
                    <div className={`w-10 h-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${isMySeatB ? 'bg-indigo-600 text-white scale-110 shadow-lg ring-2 ring-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                      {seatB}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-xs font-medium text-slate-500 border-t border-slate-50 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-600 rounded-sm" />
          <span>Your Seat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-100 rounded-sm" />
          <span>Available</span>
        </div>
      </div>
      <p className="mt-4 text-center text-[10px] text-slate-400 italic">
        * This is a schematic representation matching the official seating plan layout.
      </p>
    </div>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState<StudentSeat | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (!query) return;

    const found = SEATING_DATA.find(s => 
      s.enrollmentId.trim().toUpperCase() === query
    );
    setResult(found || null);
    setHasSearched(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResult(null);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-indigo-900 text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
              <GraduationCap size={40} className="text-indigo-200" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2"
          >
            SeatFinder
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-indigo-200 font-bold text-lg"
          >
            SAGE University Indore
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-indigo-300/80 text-sm font-medium mt-1"
          >
            ATKT Examination JULY-DEC 2025
          </motion.p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 -mt-8">
        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 border border-slate-100"
        >
          <form onSubmit={handleSearch} className="relative">
            <label htmlFor="search" className="block text-sm font-semibold text-slate-500 mb-3 ml-1">
              Enter Enrollment ID
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400">
                <Search size={20} />
              </div>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. 23ENG1EEE0021"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all text-lg font-medium placeholder:text-slate-300"
              />
              <button
                type="submit"
                className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-md"
              >
                Search
              </button>
            </div>
          </form>
        </motion.div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {hasSearched ? (
            result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Main Info Card */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
                  <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                    <span className="text-indigo-100 text-sm font-bold tracking-wider uppercase">Seating Details</span>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                      Confirmed
                    </span>
                  </div>
                  <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                          <User size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Enrollment ID</p>
                          <p className="text-xl font-bold text-slate-800">{result.enrollmentId}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Room & Seat</p>
                          <p className="text-xl font-bold text-slate-800">
                            Room {result.room} <span className="text-indigo-600 mx-1">•</span> Seat {result.seat}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                          <Building2 size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                          <p className="text-lg font-semibold text-slate-700">{result.block}</p>
                          <p className="text-sm text-slate-500">{result.floor}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                          <Calendar size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Date</p>
                          <p className="text-lg font-semibold text-slate-700">{result.date}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                          <Clock size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Timing</p>
                          <p className="text-lg font-semibold text-slate-700">{result.time}</p>
                        </div>
                      </div>

                      <button
                        onClick={clearSearch}
                        className="w-full mt-4 py-3 border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
                      >
                        Search Another
                      </button>
                    </div>
                  </div>
                </div>

                {/* Visual Seat Map */}
                <SeatMap result={result} />
              </motion.div>
            ) : (
              <motion.div
                key="no-result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-lg p-12 text-center border border-slate-100"
              >
                <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Info size={40} className="text-rose-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Record Not Found</h3>
                <div className="max-w-sm mx-auto space-y-4">
                  <p className="text-slate-500">
                    We couldn't find a detailed seat for <span className="font-bold text-slate-700">"{searchQuery}"</span>.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Possible Reasons:</p>
                    <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                      <li>The enrollment ID was entered incorrectly.</li>
                      <li>Detailed seating data for your room (e.g., FR-19 or FR-02) has not been uploaded yet.</li>
                      <li>You are not scheduled for this exam session.</li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={clearSearch}
                  className="mt-8 px-8 py-3 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )
          ) : (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Data Coverage Status */}
              <div className="md:col-span-2 bg-indigo-900 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold tracking-widest uppercase text-indigo-300">System Status</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Data Coverage Report</h3>
                  <p className="text-indigo-200 text-sm mb-6">
                    Currently, detailed seating (bench numbers) is available for <span className="text-white font-bold">Room FR-1</span>, <span className="text-white font-bold">Room FR-2</span>, and <span className="text-white font-bold">Room FR-19</span>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                      <p className="text-xs font-bold text-indigo-300 uppercase mb-1">Room FR-1</p>
                      <p className="text-lg font-bold">47 Students</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1">✓ Detailed Data Loaded</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                      <p className="text-xs font-bold text-indigo-300 uppercase mb-1">Room FR-2</p>
                      <p className="text-lg font-bold">17 Students</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1">✓ Detailed Data Loaded</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                      <p className="text-xs font-bold text-indigo-300 uppercase mb-1">Room FR-19</p>
                      <p className="text-lg font-bold">149 Students</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1">✓ Detailed Data Loaded</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
              </div>

              {/* Quick Info Cards */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-start gap-4">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                  <Info size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Test Search</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-3">
                    Try searching for these IDs to see how it works:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['23ENG1EEE0021', '24MGT4ABM0006', '25ENG9MEC0044'].map(id => (
                      <button
                        key={id}
                        onClick={() => setSearchQuery(id)}
                        className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-start gap-4">
                <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Exam Timing</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    All exams are scheduled from 11:00 AM to 2:00 PM. Please arrive 30 minutes early.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-400">
        <p className="text-sm">© 2026 SAGE University Indore • Examination Department</p>
        <p className="text-[10px] mt-2 uppercase tracking-widest font-bold">Kailod Kartal, Indore-Dewas, By-Pass Road</p>
      </footer>
    </div>
  );
}
