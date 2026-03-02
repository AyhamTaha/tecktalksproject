"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, X, Clock } from "lucide-react";
import { useState } from "react";

type Difficulty = "easy" | "medium" | "hard";

interface Session {
  id: string;
  subject: string;
  topic: string;
  time: string;
  duration: string;
  difficulty: Difficulty;
}

const difficultyStyles: Record<Difficulty, string> = {
  easy:   "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard:   "bg-red-100 text-red-800",
};

function AddSessionModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Omit<Session,"id">) => void }) {
  const [subject, setSubject]       = useState("");
  const [topic, setTopic]           = useState("");
  const [date, setDate]             = useState("");
  const [time, setTime]             = useState("10:00");
  const [duration, setDuration]     = useState("1h");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [errors, setErrors]         = useState<Record<string,string>>({});

  function handleSubmit() {
    const e: Record<string,string> = {};
    if (!subject.trim()) e.subject = "Subject is required";
    if (!topic.trim())   e.topic   = "Topic is required";
    if (!date)           e.date    = "Date is required";
    if (Object.keys(e).length) { setErrors(e); return; }

    const d = new Date(date + "T00:00:00");
    const today = new Date(); const tmrw = new Date(); tmrw.setDate(today.getDate()+1);
    const dayLabel = d.toDateString()===today.toDateString() ? "Today"
      : d.toDateString()===tmrw.toDateString() ? "Tomorrow"
      : d.toLocaleDateString("en-US",{weekday:"long"});
    const [h,m] = time.split(":").map(Number);
    const timeLabel = `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`;

    onAdd({ subject:subject.trim(), topic:topic.trim(), time:`${dayLabel}, ${timeLabel}`, duration, difficulty });
    onClose();
  }

  const inp = (f: string) => `w-full text-sm border rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors[f]?"border-red-400 bg-red-50":"border-gray-200"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white"/>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Add Study Session</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500"/></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject <span className="text-red-400">*</span></label>
            <input autoFocus type="text" value={subject} onChange={e=>{setSubject(e.target.value);setErrors(p=>({...p,subject:""}))}} placeholder="e.g. Data Structures" className={inp("subject")}/>
            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Topic <span className="text-red-400">*</span></label>
            <input type="text" value={topic} onChange={e=>{setTopic(e.target.value);setErrors(p=>({...p,topic:""}))}} placeholder="e.g. Binary Trees" className={inp("topic")}/>
            {errors.topic && <p className="text-xs text-red-500 mt-1">{errors.topic}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date <span className="text-red-400">*</span></label>
              <input type="date" value={date} onChange={e=>{setDate(e.target.value);setErrors(p=>({...p,date:""}))}} className={inp("date")}/>
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
              <input type="time" value={time} onChange={e=>setTime(e.target.value)} className={inp("")}/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
            <div className="flex gap-2">
              {["0.5h","1h","1.5h","2h","2.5h","3h"].map(d=>(
                <button key={d} onClick={()=>setDuration(d)} className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${duration===d?"border-blue-500 bg-blue-50 text-blue-700":"border-gray-200 bg-gray-50 text-gray-500"}`}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
            <div className="flex gap-2">
              {(["easy","medium","hard"] as Difficulty[]).map(d=>(
                <button key={d} onClick={()=>setDifficulty(d)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize border-2 transition-all ${
                  difficulty===d ? d==="easy"?"border-green-400 bg-green-50 text-green-700":d==="medium"?"border-yellow-400 bg-yellow-50 text-yellow-700":"border-red-400 bg-red-50 text-red-700"
                  :"border-gray-200 bg-gray-50 text-gray-500"}`}>{d}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90">Add Session</button>
        </div>
      </div>
    </div>
  );
}

export function UpcomingSessions() {
  const [sessions, setSessions] = useState<Session[]>([
    { id:"1", subject:"Data Structures", topic:"Binary Trees",         time:"Today, 2:00 PM",    duration:"2h",   difficulty:"hard"   },
    { id:"2", subject:"Calculus II",     topic:"Integration by Parts", time:"Tomorrow, 4:00 PM", duration:"1.5h", difficulty:"medium" },
    { id:"3", subject:"Web Development", topic:"React Hooks",          time:"Friday, 6:00 PM",   duration:"2h",   difficulty:"easy"   },
    { id:"4", subject:"Physics",         topic:"Quantum Mechanics",    time:"Saturday, 3:00 PM", duration:"2.5h", difficulty:"hard"   },
  ]);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Study Sessions</CardTitle>
          <button onClick={()=>setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg md:px-3 md:py-1.5 px-2 md:text-sm text-xs hover:opacity-90 transition-opacity flex-shrink-0">
            <Plus className="w-4 h-4"/><span>Add Session</span>
          </button>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3"/>
              <p className="text-sm font-medium text-gray-500">No sessions yet</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add Session" to schedule one</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map(session=>(
                <div key={session.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <Calendar className="w-5 h-5 text-white"/>
                  </div>
                  <div className="flex-1 mx-4 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{session.subject}</h3>
                    <p className="text-xs text-gray-600 truncate">{session.topic}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/>{session.time}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">{session.duration}</span>
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium capitalize ${difficultyStyles[session.difficulty]}`}>{session.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {showModal && <AddSessionModal onClose={()=>setShowModal(false)} onAdd={s=>setSessions(p=>[...p,{...s,id:Date.now().toString()}])}/>}
    </>
  );
}