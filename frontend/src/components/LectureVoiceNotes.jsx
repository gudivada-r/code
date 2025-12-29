import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, FileAudio, FileText, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const LectureVoiceNotes = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null); // { transcript: '', summary: [] }
    const [targetLanguage, setTargetLanguage] = useState(localStorage.getItem('defaultLanguage') || 'English');

    const languages = [
        "English", "Spanish", "Mandarin Chinese", "Hindi", "French",
        "Arabic", "Bengali", "Portuguese", "Russian", "Urdu"
    ];

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioBlob(file);
            setRecordingTime(0);
        }
    };


    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setResult(null);

            // Start Timer
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please ensure permissions are granted.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const handleTranscribe = async () => {
        if (!audioBlob) return;
        setProcessing(true);

        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        formData.append('language', targetLanguage);

        try {
            const res = await api.post('/api/ai/transcribe', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
        } catch (error) {
            console.error("Transcription failed", error);
            // Fallback for demo (Multilingual support)
            const demoText = {
                "Spanish": {
                    transcript: "Transcripción de demostración: La llamada a la API falló, pero así es como se vería. Discutimos la importancia de los componentes de React.",
                    summary: ["Tema: React Hooks", "Punto clave: useState gestiona el estado local", "Punto clave: useEffect maneja efectos secundarios"]
                },
                "French": {
                    transcript: "Transcription de démonstration: L'appel API a échoué, mais voici à quoi cela ressemblerait. Nous avons discuté de l'importance des composants React.",
                    summary: ["Sujet: React Hooks", "Point clé: useState gère l'état local", "Point clé: useEffect gère les effets secondaires"]
                },
                "Mandarin Chinese": {
                    transcript: "演示记录：API调用失败，但这将是它的样子。我们讨论了React组件的重要性。",
                    summary: ["主题：React Hooks", "关键点：useState管理本地状态", "关键点：useEffect处理副作用"]
                }
            };

            const fallback = demoText[targetLanguage] || {
                transcript: `Demo Transcript (${targetLanguage}): The API call failed, but here is what it would look like. We discussed the importance of React components and how hooks manage state.`,
                summary: [`Topic: React Hooks (${targetLanguage})`, "Key Point: useState manages local state", "Key Point: useEffect handles side effects"]
            };

            setResult(fallback);
        } finally {
            setProcessing(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Mic className="text-primary" size={32} color="#4f46e5" />
                    Lecture Voice Notes
                </h2>
                <p style={{ color: '#64748b' }}>Record your lectures and let AI transcribe and summarize them for you.</p>
            </div>

            {/* Recorder Interface */}
            <div className="card-white" style={{ textAlign: 'center', padding: '3rem', marginBottom: '2rem' }}>
                <div style={{ marginBottom: '2rem', fontSize: '3rem', fontFamily: 'monospace', fontWeight: '700', color: isRecording ? '#ef4444' : '#1e293b' }}>
                    {formatTime(recordingTime)}
                </div>

                {!isRecording && !audioBlob && (
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                            onClick={startRecording}
                            style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)' }}
                        >
                            <Mic size={40} color="white" />
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                            <input
                                type="file"
                                accept="audio/*"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                style={{ padding: '0.8rem', borderRadius: '50%', background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <span style={{ fontSize: '24px' }}>📂</span>
                            </button>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Upload</span>
                        </div>
                    </div>
                )}

                {isRecording && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#ef4444' }} />
                        </motion.div>
                        <button
                            onClick={stopRecording}
                            style={{ padding: '0.8rem 2rem', background: '#1e293b', color: 'white', borderRadius: '30px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Stop Recording
                        </button>
                    </div>
                )}

                {!isRecording && audioBlob && !result && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
                            <FileAudio size={24} />
                            <span>Recording Saved ({formatTime(recordingTime)})</span>
                        </div>

                        {/* Language Selector */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Output Language</label>
                            <select
                                value={targetLanguage}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '200px' }}
                            >
                                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => { setAudioBlob(null); setRecordingTime(0); }}
                                style={{ padding: '0.8rem 1.5rem', background: 'white', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleTranscribe}
                                disabled={processing}
                                style={{ padding: '0.8rem 1.5rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                {processing ? <Loader2 className="spin" size={18} /> : <FileText size={18} />}
                                {processing ? 'Translating...' : 'Transcribe & Summarize'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Results */}
            {result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                        {/* Summary Card */}
                        <div className="card-white" style={{ borderLeft: '4px solid #4f46e5' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Check size={20} color="#4f46e5" /> Key Takeaways
                            </h3>
                            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {result.summary.map((point, i) => (
                                    <li key={i} style={{ color: '#334155', lineHeight: '1.5' }}>{point}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Transcript Card */}
                        <div className="card-white">
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={20} color="#64748b" /> Full Transcript
                            </h3>
                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', color: '#475569', lineHeight: '1.6', maxHeight: '300px', overflowY: 'auto' }}>
                                {result.transcript}
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button
                                onClick={() => { setAudioBlob(null); setResult(null); setRecordingTime(0); }}
                                style={{ background: 'transparent', border: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer' }}
                            >
                                Record New Lecture
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default LectureVoiceNotes;
