import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { GRID_WIDTH, GRID_HEIGHT, HOSPITAL_DEPARTMENTS } from '../data/hospitalLayout';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  AlertTriangle, 
  PlusCircle, 
  Compass, 
  Search, 
  Navigation,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';

export const VirtualHospitalMap: React.FC = () => {
  const {
    robotState,
    obstacles,
    activeDestination,
    navigateTo,
    pauseNavigation,
    resumeNavigation,
    cancelNavigation,
    returnToReception,
    emergencyStop,
    addObstacle,
    removeObstacle,
    clearDynamicObstacles
  } = useHospital();

  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [obstacleMode, setObstacleMode] = useState<boolean>(false);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  // Filter departments for search
  const filteredDepartments = HOSPITAL_DEPARTMENTS.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDispatch = () => {
    if (selectedDeptId) {
      navigateTo(selectedDeptId);
    }
  };

  // Cell click for placing obstacle or inspecting
  const handleCellClick = (x: number, y: number) => {
    // Check if clicked an existing obstacle
    const existingObs = obstacles.find(o => o.x === x && o.y === y);
    if (existingObs) {
      removeObstacle(existingObs.id);
      return;
    }

    // Check if clicked inside a department
    const clickedDept = HOSPITAL_DEPARTMENTS.find(d => 
      x >= d.bounds.x && x < d.bounds.x + d.bounds.w &&
      y >= d.bounds.y && y < d.bounds.y + d.bounds.h
    );

    if (clickedDept && !obstacleMode) {
      setSelectedDeptId(clickedDept.id);
      navigateTo(clickedDept.id);
      return;
    }

    // If obstacle mode is active or user clicks corridor
    if (obstacleMode || (!clickedDept && x > 0 && x < GRID_WIDTH - 1 && y > 0 && y < GRID_HEIGHT - 1)) {
      addObstacle(x, y, 'Dynamic Obstacle (Corridor Block)');
    }
  };

  // Inject obstacle directly on robot's next path
  const injectObstacleOnRoute = () => {
    if (robotState.activePath.length > robotState.currentPathIndex + 2) {
      const targetPoint = robotState.activePath[robotState.currentPathIndex + 2];
      addObstacle(targetPoint.x, targetPoint.y, 'Emergency Stretcher In Transit');
    } else {
      addObstacle(11, 10, 'Maintenance Cleaning Cart');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Dispatcher Bar */}
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-cyan-500/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-tech tracking-wide text-white flex items-center gap-2">
              VIRTUAL HOSPITAL DIGITAL TWIN MAP
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono-num">
                A* GRID 28x20
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive top-down navigation simulation, live telemetry, and collision avoidance
            </p>
          </div>
        </div>

        {/* Quick Destination Search & Dispatch */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search department / room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-navy-900/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-52"
            />
          </div>

          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="">Select Destination...</option>
            {filteredDepartments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.code} - {dept.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleDispatch}
            disabled={!selectedDeptId || robotState.status === 'navigating'}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-navy-950 font-bold text-sm rounded-xl transition shadow-lg shadow-cyan-500/20"
          >
            <Navigation className="w-4 h-4" />
            Send SORA
          </button>

          <button
            onClick={returnToReception}
            className="flex items-center gap-2 px-3.5 py-2 bg-navy-800 hover:bg-navy-700 border border-slate-600 text-xs font-semibold rounded-xl text-slate-200 transition"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            Dock at Reception
          </button>
        </div>
      </div>

      {/* Main Map View & Real-time Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive Floor Plan Canvas (3 Cols) */}
        <div className="lg:col-span-3 glass-panel-glow p-5 rounded-2xl relative overflow-hidden flex flex-col items-center">
          {/* Map Top Status Header */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3 px-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-slate-300 font-mono-num">
                  Pos: [{robotState.position.x}, {robotState.position.y}]
                </span>
              </span>
              <span className="text-slate-300 font-mono-num">
                Heading: {robotState.headingAngle}°
              </span>
              <span className="text-slate-300">
                Zone: <strong className="text-cyan-300">{robotState.currentZone}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setObstacleMode(!obstacleMode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                  obstacleMode 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                    : 'bg-navy-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {obstacleMode ? 'Obstacle Mode ON (Click cell)' : 'Place Obstacle'}
              </button>

              <button
                onClick={injectObstacleOnRoute}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Spawn Obstacle on Route
              </button>

              {obstacles.length > 0 && (
                <button
                  onClick={clearDynamicObstacles}
                  className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold transition"
                >
                  Clear Obstacles
                </button>
              )}
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="w-full relative overflow-x-auto select-none rounded-xl bg-navy-950/90 border border-cyan-500/30 p-2 shadow-2xl">
            <svg
              viewBox={`0 0 ${GRID_WIDTH * 36} ${GRID_HEIGHT * 36}`}
              className="w-full h-auto min-w-[700px] max-h-[620px]"
            >
              <defs>
                {/* Corridor Pattern Grid */}
                <pattern id="corridorGrid" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(34, 211, 238, 0.04)" strokeWidth="1" />
                </pattern>

                {/* Floor hazard stripe */}
                <pattern id="hazardStripe" width="12" height="12" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                  <rect width="6" height="12" fill="#ef4444" opacity="0.25" />
                  <rect x="6" width="6" height="12" fill="#0c1836" opacity="0.8" />
                </pattern>

                {/* Glow Filter for Active Path */}
                <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="robotGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Base Background Floor */}
              <rect
                x="0"
                y="0"
                width={GRID_WIDTH * 36}
                height={GRID_HEIGHT * 36}
                fill="#070f21"
              />
              <rect
                x="0"
                y="0"
                width={GRID_WIDTH * 36}
                height={GRID_HEIGHT * 36}
                fill="url(#corridorGrid)"
              />

              {/* Outer Perimeter Hospital Walls */}
              <rect
                x="0"
                y="0"
                width={GRID_WIDTH * 36}
                height={GRID_HEIGHT * 36}
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="12"
              />

              {/* Hospital Rooms & Department Enclosures */}
              {HOSPITAL_DEPARTMENTS.map(dept => {
                const rx = dept.bounds.x * 36;
                const ry = dept.bounds.y * 36;
                const rw = dept.bounds.w * 36;
                const rh = dept.bounds.h * 36;
                const isTarget = activeDestination?.id === dept.id;

                return (
                  <g
                    key={dept.id}
                    onClick={() => {
                      setSelectedDeptId(dept.id);
                      navigateTo(dept.id);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Room Floor Fill */}
                    <rect
                      x={rx + 4}
                      y={ry + 4}
                      width={rw - 8}
                      height={rh - 8}
                      rx="10"
                      fill={isTarget ? `${dept.color}33` : '#0d1d3b'}
                      stroke={isTarget ? dept.color : `${dept.color}88`}
                      strokeWidth={isTarget ? "3" : "1.8"}
                      strokeDasharray={isTarget ? "6 3" : undefined}
                      className="transition-all duration-300 group-hover:fill-opacity-40"
                    />

                    {/* Room Interior Accent Glow */}
                    <circle
                      cx={rx + rw / 2}
                      cy={ry + rh / 2 - 8}
                      r="16"
                      fill={`${dept.color}20`}
                    />

                    {/* Department Code & Title */}
                    <text
                      x={rx + rw / 2}
                      y={ry + rh / 2 - 12}
                      textAnchor="middle"
                      fill={dept.color}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      letterSpacing="1"
                    >
                      {dept.code}
                    </text>
                    <text
                      x={rx + rw / 2}
                      y={ry + rh / 2 + 5}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      {dept.name.split(' (')[0].replace(' & SORA Dock', '')}
                    </text>
                    <text
                      x={rx + rw / 2}
                      y={ry + rh / 2 + 18}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="8"
                    >
                      {dept.category.toUpperCase()}
                    </text>

                    {/* Designated Doorway Marker */}
                    <rect
                      x={dept.doorGrid.x * 36 + 6}
                      y={dept.doorGrid.y * 36 + 6}
                      width="24"
                      height="24"
                      rx="4"
                      fill={`${dept.color}25`}
                      stroke={dept.color}
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={dept.doorGrid.x * 36 + 18}
                      y={dept.doorGrid.y * 36 + 21}
                      textAnchor="middle"
                      fill={dept.color}
                      fontSize="8"
                      fontWeight="bold"
                    >
                      DOOR
                    </text>
                  </g>
                );
              })}

              {/* Clickable Grid Overlay for Obstacle placement & Coordinates */}
              {Array.from({ length: GRID_HEIGHT }).map((_, gy) =>
                Array.from({ length: GRID_WIDTH }).map((_, gx) => (
                  <rect
                    key={`grid-${gx}-${gy}`}
                    x={gx * 36}
                    y={gy * 36}
                    width="36"
                    height="36"
                    fill="transparent"
                    onMouseEnter={() => setHoveredCell({ x: gx, y: gy })}
                    onClick={() => handleCellClick(gx, gy)}
                    className="hover:stroke-cyan-400 hover:stroke-1 hover:fill-cyan-500/10 cursor-crosshair"
                  />
                ))
              )}

              {/* Active A* Calculated Trajectory Path */}
              {robotState.activePath.length > 1 && (
                <g>
                  {/* Glowing Route Polyline */}
                  <polyline
                    points={robotState.activePath
                      .map(p => `${p.x * 36 + 18},${p.y * 36 + 18}`)
                      .join(' ')}
                    fill="none"
                    stroke="#00e5ff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="8 4"
                    filter="url(#cyanGlow)"
                    className="animate-pulse"
                  />

                  {/* Waypoint Dots */}
                  {robotState.activePath.map((pt, idx) => (
                    <circle
                      key={`wp-${idx}`}
                      cx={pt.x * 36 + 18}
                      cy={pt.y * 36 + 18}
                      r={idx === robotState.activePath.length - 1 ? 6 : 2.5}
                      fill={idx === robotState.activePath.length - 1 ? '#10b981' : '#22d3ee'}
                      stroke="#ffffff"
                      strokeWidth={idx === robotState.activePath.length - 1 ? '2' : '0.5'}
                    />
                  ))}
                </g>
              )}

              {/* Obstacles Rendering */}
              {obstacles.map(obs => (
                <g
                  key={obs.id}
                  onClick={() => removeObstacle(obs.id)}
                  className="cursor-pointer"
                >
                  {/* Obstacle Warning Circle */}
                  <circle
                    cx={obs.x * 36 + 18}
                    cy={obs.y * 36 + 18}
                    r="15"
                    fill="#ef4444"
                    fillOpacity="0.85"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  {/* Hazard Cross / Icon */}
                  <text
                    x={obs.x * 36 + 18}
                    y={obs.y * 36 + 23}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    ⚠
                  </text>
                  {/* Obstacle Label */}
                  <rect
                    x={obs.x * 36 - 25}
                    y={obs.y * 36 - 14}
                    width="86"
                    height="16"
                    rx="3"
                    fill="#0f172a"
                    stroke="#ef4444"
                    strokeWidth="1"
                  />
                  <text
                    x={obs.x * 36 + 18}
                    y={obs.y * 36 - 2}
                    textAnchor="middle"
                    fill="#fecaca"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {obs.label.substring(0, 16)}
                  </text>
                </g>
              ))}

              {/* SORA Autonomous Robot Representation */}
              <g
                transform={`translate(${robotState.position.x * 36 + 18}, ${robotState.position.y * 36 + 18})`}
                className="transition-transform duration-500 ease-linear"
              >
                {/* Dynamic Radar Scan Cone when Navigating */}
                {robotState.status === 'navigating' && (
                  <path
                    d="M 0 0 L -28 -55 A 60 60 0 0 1 28 -55 Z"
                    fill="rgba(34, 211, 238, 0.22)"
                    transform={`rotate(${robotState.headingAngle})`}
                  />
                )}

                {/* SORA Base Pulse Aura */}
                <circle
                  r="22"
                  fill="none"
                  stroke={robotState.emergencyActive ? '#ef4444' : '#00e5ff'}
                  strokeWidth="2"
                  filter="url(#robotGlow)"
                  className="animate-ping"
                  opacity="0.6"
                />

                {/* Robot Chassis Body */}
                <circle
                  r="16"
                  fill="#0c1a36"
                  stroke={robotState.emergencyActive ? '#ef4444' : '#22d3ee'}
                  strokeWidth="2.5"
                />

                {/* Powered Wheels */}
                <rect x="-18" y="-7" width="4" height="14" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="0.5" />
                <rect x="14" y="-7" width="4" height="14" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="0.5" />

                {/* Head Module with Directional Pointer */}
                <g transform={`rotate(${robotState.headingAngle})`}>
                  {/* Visor / Camera Head */}
                  <circle cx="0" cy="-6" r="6" fill="#00e5ff" />
                  {/* Directional Heading Needle */}
                  <polygon points="0,-16 -4,-8 4,-8" fill="#ffffff" />
                </g>

                {/* SORA Text Badge */}
                <circle cx="0" cy="0" r="8" fill="#1e293b" />
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fill="#00e5ff"
                  fontSize="7"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  SORA
                </text>
              </g>
            </svg>
          </div>

          {/* Map Controls Toolbar */}
          <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2">
              {robotState.status === 'navigating' ? (
                <button
                  onClick={pauseNavigation}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Pause className="w-3.5 h-3.5" />
                  Pause
                </button>
              ) : robotState.status === 'paused' ? (
                <button
                  onClick={resumeNavigation}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5" />
                  Resume
                </button>
              ) : null}

              {(robotState.status === 'navigating' || robotState.status === 'paused') && (
                <button
                  onClick={cancelNavigation}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Square className="w-3.5 h-3.5" />
                  Cancel Journey
                </button>
              )}

              <button
                onClick={emergencyStop}
                className="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Emergency Stop
              </button>
            </div>

            {/* Hovered grid coordinate readout */}
            <div className="text-xs text-slate-400 font-mono-num flex items-center gap-3">
              {hoveredCell && (
                <span>Cursor: [{hoveredCell.x}, {hoveredCell.y}]</span>
              )}
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400">Total Escorts: {robotState.completedTasksCount}</span>
            </div>
          </div>
        </div>

        {/* Right Info & Live Navigation Telemetry Sidebar */}
        <div className="space-y-4">
          {/* Active Navigation Card */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              Active Route Status
            </h3>

            {robotState.targetDestinationName ? (
              <div className="space-y-3">
                <div className="p-3 bg-navy-900/80 rounded-xl border border-cyan-500/30">
                  <div className="text-xs text-slate-400">Target Destination</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {robotState.targetDestinationName}
                  </div>
                  <div className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {robotState.currentTask}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-navy-900/60 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Waypoints</span>
                    <span className="font-mono-num font-bold text-white text-sm">
                      {robotState.currentPathIndex} / {robotState.activePath.length}
                    </span>
                  </div>
                  <div className="p-2.5 bg-navy-900/60 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Remaining Est.</span>
                    <span className="font-mono-num font-bold text-cyan-300 text-sm">
                      {Math.max(0, (robotState.activePath.length - robotState.currentPathIndex) * 1.2).toFixed(1)} s
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-300"
                    style={{
                      width: `${robotState.activePath.length > 0 
                        ? (robotState.currentPathIndex / robotState.activePath.length) * 100 
                        : 100}%`
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                <Info className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                SORA is currently docked and idle. Select a department to begin autonomous navigation.
              </div>
            )}
          </div>

          {/* Quick Department Shortcuts */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
              Rapid Destination Escort
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {HOSPITAL_DEPARTMENTS.slice(0, 6).map(dept => (
                <button
                  key={dept.id}
                  onClick={() => {
                    setSelectedDeptId(dept.id);
                    navigateTo(dept.id);
                  }}
                  className="p-2.5 text-left bg-navy-900/70 hover:bg-navy-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition group"
                >
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                    {dept.name.split(' (')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono-num">
                    {dept.code}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map Legend */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-300 uppercase tracking-wider mb-2 text-[11px]">
              Floor Map Legend
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-slate-300">SORA Robot (with LiDAR field)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1 bg-cyan-400 border border-cyan-300" />
              <span className="text-slate-300">A* Optimal Trajectory Path</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-slate-300">Dynamic Obstacle (Avoidance Active)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded border border-cyan-500/50 bg-cyan-500/10" />
              <span className="text-slate-300">Hospital Department Rooms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
