import React, { useCallback, useEffect, useRef, useState } from "react";

const LAYOUTS = [
  { id: "preacher-left-bible-right", name: "Preacher left · Bible right", description: "Preacher on the left, scripture panel on the right." },
  { id: "bible-left-preacher-right", name: "Bible left · Preacher right", description: "Scripture on the left, preacher on the right." },
  { id: "preacher-bottom-bible-top", name: "Bible top · Preacher bottom", description: "Scripture above with preacher in the lower area." },
  { id: "preacher-full", name: "Full-screen preacher", description: "Preacher fills the programme screen." }
];

export default function LiveComposition({ onVideoReady, onVideoStopped, onLayoutChange, onSendPreacher, active }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [status, setStatus] = useState("OBS Virtual Camera not connected");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [layout, setLayout] = useState(LAYOUTS[0].id);

  const refreshDevices = useCallback(async () => {
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      const cameras = all.filter(d => d.kind === "videoinput");
      setDevices(cameras);
      const obs = cameras.find(d => /obs virtual camera/i.test(d.label));
      if (obs) setDeviceId(current => obs ? obs.deviceId : (current || cameras[0]?.deviceId || ""));
    } catch (e) { setError("Could not list camera devices: " + (e.message || e)); }
  }, []);

  useEffect(() => {
    refreshDevices();
    navigator.mediaDevices?.addEventListener?.("devicechange", refreshDevices);
    return () => navigator.mediaDevices?.removeEventListener?.("devicechange", refreshDevices);
  }, [refreshDevices]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setRunning(false);
    setStatus("Camera disconnected");
    onVideoStopped?.();
  }, [onVideoStopped]);

  const startCamera = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is unavailable. Open the installed Windows desktop app and allow camera permission.");
      return;
    }
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: deviceId ? { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } } : { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        onVideoReady?.(videoRef.current);
      }
      setRunning(true);
      const selected = devices.find(d => d.deviceId === deviceId);
      setStatus("Receiving live video from " + (selected?.label || "selected camera"));
      await refreshDevices();
    } catch (e) {
      setError((e.name === "NotAllowedError" ? "Camera permission was denied. Allow camera access for Church Media Studio in Windows Settings." : e.message) || "Could not start the selected camera.");
      setStatus("Camera could not start");
    }
  };

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  return <section className="content-panel production-panel" style={{display:active?"block":"none"}}>
    <div className="panel-heading"><div><h2>OBS Live Camera & Composition</h2><p>OBS controls the physical camera. Church Media Studio receives OBS Virtual Camera and composes the preacher with scripture.</p></div><span className="small-label">LIVE VIDEO INPUT</span></div>
    <div className="obs-workflow">
      <div className="settings-section"><h3>OBS camera workflow</h3><ol className="ndi-steps">
        <li>In OBS, create a dedicated scene and add your physical camera as a <strong>Video Capture Device</strong>. Keep only the camera in this scene.</li>
        <li>Keep the green backdrop visible in this dedicated camera scene. Church Media Studio will remove the green and place the preacher.</li>
        <li>In OBS, click <strong>Start Virtual Camera</strong>.</li>
        <li>Select <strong>OBS Virtual Camera</strong> below, then start the input.</li>
        <li>Choose a preacher/Bible layout and send the preacher composition live. Church Media Studio sends the finished picture to OBS as NDI.</li>
      </ol></div>
      <div className="settings-section">
        <h3>Live video source</h3>
        <label>Camera input<select value={deviceId} onChange={e=>setDeviceId(e.target.value)} disabled={running}>
          {devices.length===0 && <option value="">No camera devices found</option>}
          {devices.map((d,i)=><option key={d.deviceId || i} value={d.deviceId}>{d.label || "Camera "+(i+1)}</option>)}
        </select></label>
        <div className="button-row"><button className="primary-btn" onClick={startCamera} disabled={running || !deviceId}>Start live camera</button><button className="secondary-btn" onClick={stopCamera} disabled={!running}>Stop camera</button><button className="secondary-btn" onClick={refreshDevices}>Refresh devices</button></div>
        <div className={"camera-status "+(running?"active":"")}>{status}</div>
        {error && <div className="error-box">{error}</div>}
        <video ref={videoRef} className="live-camera-preview" muted playsInline autoPlay />
        <p className="hint">If the device list does not show OBS Virtual Camera, start it in OBS and press Refresh devices.</p>
      </div>
    </div>
    <div className="settings-section">
      <h3>Preacher and Bible screen positions</h3>
      <div className="layout-choice-grid">{LAYOUTS.map(item=><button type="button" key={item.id} className={"layout-choice "+(layout===item.id?"selected":"")} onClick={()=>{setLayout(item.id);onLayoutChange?.(item.id);}}>
        <span className={"layout-mini "+item.id}><i></i><b></b></span><strong>{item.name}</strong><small>{item.description}</small>
      </button>)}</div>
      <div className="button-row"><button className="primary-btn" disabled={!running} onClick={onSendPreacher}>Send live preacher composition</button><span className="hint">Bible text is taken from the last Bible verse you sent live.</span></div>
    </div>
  </section>;
}
