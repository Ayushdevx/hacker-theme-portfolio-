"use client";

import { useEffect, useState } from "react";

const EVENTS = [
  { type: "INTRUSION", message: "Unauthorized access detected from 192.168.1.42:443" },
  { type: "SCAN", message: "Port scan detected from 10.0.0.5" },
  { type: "LOGIN", message: "Successful root login from 172.16.0.2" },
  { type: "FIREWALL", message: "Firewall rule updated: Allow 22/tcp" },
  { type: "EXPLOIT", message: "Exploit attempt blocked on port 3306" },
  { type: "MALWARE", message: "Malware signature detected in /tmp/evil.sh" },
  { type: "PRIVESC", message: "Privilege escalation attempt detected" },
  { type: "LOGOUT", message: "User root logged out from 172.16.0.2" },
  { type: "PATCH", message: "Security patch applied: CVE-2024-1234" },
  { type: "DOS", message: "DoS attack mitigated from 203.0.113.7" },
];

function getRandomEvent() {
  const idx = Math.floor(Math.random() * EVENTS.length);
  return EVENTS[idx];
}

export default function RecentIntrusionsFeed() {
  const [feed, setFeed] = useState<any[]>([]);
  const [typing, setTyping] = useState(false);
  const [typedMsg, setTypedMsg] = useState("");

  useEffect(() => {
    const addEvent = () => {
      const event = getRandomEvent();
      const timestamp = new Date().toLocaleTimeString();
      setTyping(true);
      let i = 0;
      setTypedMsg("");
      const type = () => {
        setTypedMsg(event.message.slice(0, i + 1));
        i++;
        if (i < event.message.length) setTimeout(type, 18);
        else {
          setTyping(false);
          setFeed((f) => [
            { ...event, timestamp },
            ...f.slice(0, 9)
          ]);
        }
      };
      type();
    };
    const interval = setInterval(addEvent, 2500);
    addEvent();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/80 border border-green-500 rounded-lg p-4 font-mono text-green-400 max-w-xl mx-auto my-8 shadow-lg relative overflow-hidden">
      <div className="text-green-500 text-lg mb-2 flex items-center gap-2">
        <span className="animate-pulse">●</span> Recent Intrusions Feed
      </div>
      <div className="h-64 overflow-y-auto scrollbar-hidden">
        {typing && (
          <div className="mb-1">
            <span className="text-yellow-400">[{new Date().toLocaleTimeString()}]</span> <span className="text-red-400">INTRUSION</span> <span>{typedMsg}<span className="animate-pulse">█</span></span>
          </div>
        )}
        {feed.map((event, idx) => (
          <div key={idx} className="mb-1">
            <span className="text-yellow-400">[{event.timestamp}]</span> <span className={
              event.type === "INTRUSION" || event.type === "EXPLOIT" || event.type === "MALWARE" || event.type === "PRIVESC" || event.type === "DOS"
                ? "text-red-400"
                : event.type === "LOGIN" || event.type === "PATCH" || event.type === "FIREWALL"
                ? "text-green-400"
                : "text-cyan-400"
            }>{event.type}</span> <span>{event.message}</span>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{background: "repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(57,255,20,0.04) 8px)"}} />
    </div>
  );
} 