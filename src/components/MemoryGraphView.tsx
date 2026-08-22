import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  GitFork,
  Users,
  MapPin,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  Award,
  Filter,
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
  ArrowRight,
  X,
  Info,
} from 'lucide-react';
import { GraphLink, GraphNode, GraphNodeType, Memory, Person, UserSettings } from '../types';

interface MemoryGraphViewProps {
  memories: Memory[];
  people: Person[];
  onSelectMemory: (memory: Memory) => void;
  settings: UserSettings;
}

const NODE_COLORS: Record<GraphNodeType, { bg: string; border: string; text: string }> = {
  person: { bg: '#8B5CF6', border: '#C4B5FD', text: '#EDE9FE' },
  memory: { bg: '#6366F1', border: '#A5B4FC', text: '#EEF2FF' },
  place: { bg: '#10B981', border: '#6EE7B7', text: '#ECFDF5' },
  event: { bg: '#F59E0B', border: '#FCD34D', text: '#FEF3C7' },
  date: { bg: '#06B6D4', border: '#67E8F9', text: '#ECFEFF' },
};

export const MemoryGraphView: React.FC<MemoryGraphViewProps> = ({
  memories,
  people,
  onSelectMemory,
  settings,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<GraphNode | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Construct graph nodes & links
  const { nodes, links } = useMemo(() => {
    const nodeList: GraphNode[] = [];
    const linkList: GraphLink[] = [];

    const placeMap = new Map<string, string>();
    const eventMap = new Map<string, string>();
    const dateMap = new Map<string, string>();
    const personMap = new Map<string, string>();

    // 1. People nodes
    people.forEach((p) => {
      const nodeId = `person-${p.id}`;
      personMap.set(p.id, nodeId);
      nodeList.push({
        id: nodeId,
        label: p.name,
        type: 'person',
        subLabel: p.relation || 'Friend',
        radius: 20,
        x: 0,
        y: 0,
        photo: p.avatar,
        originalId: p.id,
      });
    });

    // 2. Memory nodes & associated entities
    memories.forEach((mem) => {
      const memNodeId = `memory-${mem.id}`;
      nodeList.push({
        id: memNodeId,
        label: mem.title,
        type: 'memory',
        subLabel: mem.category,
        radius: 24,
        x: 0,
        y: 0,
        photo: mem.photos?.[0],
        originalId: mem.id,
      });

      // Place node
      const cityKey = mem.location.city;
      let placeNodeId = placeMap.get(cityKey);
      if (!placeNodeId) {
        placeNodeId = `place-${cityKey}`;
        placeMap.set(cityKey, placeNodeId);
        nodeList.push({
          id: placeNodeId,
          label: `${mem.location.city}`,
          type: 'place',
          subLabel: mem.location.country,
          radius: 18,
          x: 0,
          y: 0,
        });
      }
      linkList.push({
        source: memNodeId,
        target: placeNodeId,
        relationship: 'LOCATED_AT',
        label: 'in',
      });

      // Event node (if any)
      if (mem.eventName) {
        let eventNodeId = eventMap.get(mem.eventName);
        if (!eventNodeId) {
          eventNodeId = `event-${mem.eventName}`;
          eventMap.set(mem.eventName, eventNodeId);
          nodeList.push({
            id: eventNodeId,
            label: mem.eventName,
            type: 'event',
            subLabel: 'Event',
            radius: 16,
            x: 0,
            y: 0,
          });
        }
        linkList.push({
          source: memNodeId,
          target: eventNodeId,
          relationship: 'PART_OF_EVENT',
          label: 'during',
        });
      }

      // Year/Date node
      const year = mem.date.slice(0, 4);
      let dateNodeId = dateMap.get(year);
      if (!dateNodeId) {
        dateNodeId = `date-${year}`;
        dateMap.set(year, dateNodeId);
        nodeList.push({
          id: dateNodeId,
          label: year,
          type: 'date',
          subLabel: 'Timeline Year',
          radius: 15,
          x: 0,
          y: 0,
        });
      }
      linkList.push({
        source: memNodeId,
        target: dateNodeId,
        relationship: 'HAPPENED_IN',
        label: 'in year',
      });

      // Connect people to memory
      mem.peopleIds.forEach((pId) => {
        const pNodeId = personMap.get(pId);
        if (pNodeId) {
          linkList.push({
            source: pNodeId,
            target: memNodeId,
            relationship: 'TOGETHER_WITH',
            label: 'with',
          });
        }
      });
    });

    // Initial circular / force layout positioning
    const width = 1000;
    const height = 700;
    const centerX = width / 2;
    const centerY = height / 2;

    nodeList.forEach((node, idx) => {
      const angle = (idx / nodeList.length) * 2 * Math.PI;
      const dist = node.type === 'memory' ? 140 : node.type === 'person' ? 240 : 320;
      node.x = centerX + Math.cos(angle) * dist + (Math.random() - 0.5) * 60;
      node.y = centerY + Math.sin(angle) * dist + (Math.random() - 0.5) * 60;
      node.vx = 0;
      node.vy = 0;
    });

    return { nodes: nodeList, links: linkList };
  }, [memories, people]);

  // Simulation physics loop
  useEffect(() => {
    let animationFrameId: number;

    const simulate = () => {
      // Force repulsion and link attraction
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < 180) {
            const force = (180 - dist) / 180 * 0.4;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            if (a !== draggedNode) {
              a.x -= fx;
              a.y -= fy;
            }
            if (b !== draggedNode) {
              b.x += fx;
              b.y += fy;
            }
          }
        }
      }

      // Link attraction
      links.forEach((link) => {
        const a = nodes.find((n) => n.id === link.source);
        const b = nodes.find((n) => n.id === link.target);
        if (a && b) {
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 90;
          const force = (dist - targetDist) * 0.008;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (a !== draggedNode) {
            a.x += fx;
            a.y += fy;
          }
          if (b !== draggedNode) {
            b.x -= fx;
            b.y -= fy;
          }
        }
      });

      // Render Canvas
      renderCanvas();
      animationFrameId = requestAnimationFrame(simulate);
    };

    animationFrameId = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [nodes, links, selectedNode, hoveredNode, zoomLevel, panOffset, filterType, searchQuery]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust canvas resolution
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);

    // Connected Node IDs when selected
    const activeNodeId = selectedNode?.id || hoveredNode?.id;
    const connectedNodeIds = new Set<string>();

    if (activeNodeId) {
      connectedNodeIds.add(activeNodeId);
      links.forEach((l) => {
        if (l.source === activeNodeId) connectedNodeIds.add(l.target);
        if (l.target === activeNodeId) connectedNodeIds.add(l.source);
      });
    }

    // 1. Draw Links
    links.forEach((link) => {
      const source = nodes.find((n) => n.id === link.source);
      const target = nodes.find((n) => n.id === link.target);
      if (!source || !target) return;

      const isConnected =
        activeNodeId &&
        (link.source === activeNodeId || link.target === activeNodeId);

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);

      if (activeNodeId) {
        if (isConnected) {
          ctx.strokeStyle = '#A855F7';
          ctx.lineWidth = 2.5;
        } else {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
          ctx.lineWidth = 1;
        }
      } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 1.2;
      }
      ctx.stroke();
    });

    // 2. Draw Nodes
    nodes.forEach((node) => {
      // Filter out if filter active
      if (filterType !== 'all' && node.type !== filterType) return;
      if (
        searchQuery &&
        !node.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return;

      const isHighlighted =
        !activeNodeId || connectedNodeIds.has(node.id);
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;

      const colors = NODE_COLORS[node.type] || {
        bg: '#8B5CF6',
        border: '#C4B5FD',
        text: '#FFF',
      };

      ctx.save();
      ctx.globalAlpha = isHighlighted ? 1.0 : 0.2;

      // Glow effect for selected
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = `${colors.bg}44`;
        ctx.fill();
      }

      // Outer circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.lineWidth = isSelected ? 3.5 : 2;
      ctx.strokeStyle = colors.bg;
      ctx.stroke();

      // Inner color dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = colors.bg;
      ctx.fill();

      // Node label
      ctx.font = isSelected ? 'bold 12px Outfit, sans-serif' : '11px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = isHighlighted ? '#F8FAFC' : '#64748B';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + node.radius + 14);

      // Node subLabel
      if (node.subLabel && isHighlighted) {
        ctx.font = '9px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = colors.border;
        ctx.fillText(node.subLabel, node.x, node.y + node.radius + 25);
      }

      ctx.restore();
    });

    ctx.restore();
  };

  // Mouse & Touch interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
    const clickY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

    // Find clicked node
    const found = nodes.find((node) => {
      const dx = node.x - clickX;
      const dy = node.y - clickY;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius + 6;
    });

    if (found) {
      setSelectedNode(found);
      setDraggedNode(found);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

    if (draggedNode) {
      draggedNode.x = mouseX;
      draggedNode.y = mouseY;
    } else if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else {
      const found = nodes.find((node) => {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        return Math.sqrt(dx * dx + dy * dy) <= node.radius + 6;
      });
      setHoveredNode(found || null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  // Connected data for the selected node
  const connectedDetails = useMemo(() => {
    if (!selectedNode) return null;

    if (selectedNode.type === 'memory') {
      const mem = memories.find((m) => m.id === selectedNode.originalId);
      return { memory: mem };
    }

    if (selectedNode.type === 'person') {
      const person = people.find((p) => p.id === selectedNode.originalId);
      const connectedMems = memories.filter((m) =>
        m.peopleIds.includes(selectedNode.originalId!)
      );
      return { person, connectedMemories: connectedMems };
    }

    if (selectedNode.type === 'place') {
      const cityName = selectedNode.label;
      const connectedMems = memories.filter(
        (m) => m.location.city.toLowerCase() === cityName.toLowerCase()
      );
      return { cityName, connectedMemories: connectedMems };
    }

    if (selectedNode.type === 'date') {
      const year = selectedNode.label;
      const connectedMems = memories.filter((m) => m.date.startsWith(year));
      return { year, connectedMemories: connectedMems };
    }

    return null;
  }, [selectedNode, memories, people]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 flex flex-col"
    >
      {/* Top Header & Judge Concept Banner */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-col gap-2 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto bg-slate-900/90 border border-slate-700/80 p-3 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
              <GitFork className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight font-display">
                  Personal Relationship Graph
                </h2>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Interactive Node Network
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                PERSON ↔ MEMORY ↔ PLACE ↔ EVENT ↔ DATE
              </p>
            </div>
          </div>

          {/* Node Type Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Nodes' },
              { id: 'person', label: 'People' },
              { id: 'memory', label: 'Memories' },
              { id: 'place', label: 'Places' },
              { id: 'event', label: 'Events' },
              { id: 'date', label: 'Years' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === tab.id
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'bg-[#11111A] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Controls: Zoom, Reset */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 2.0))}
              className="p-1.5 rounded-lg bg-[#11111A] text-slate-300 hover:text-white border border-slate-800"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.5))}
              className="p-1.5 rounded-lg bg-[#11111A] text-slate-300 hover:text-white border border-slate-800"
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
                setSelectedNode(null);
              }}
              className="p-1.5 rounded-lg bg-[#11111A] text-slate-300 hover:text-white border border-slate-800"
              title="Reset View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search inside Graph */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-violet-400" />
            <input
              type="text"
              placeholder="Search Rahul, Nagpur, Hackathon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#11111A] text-xs text-white border border-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div className="text-[11px] text-slate-400 bg-[#11111A]/90 px-3 py-1.5 rounded-xl border border-slate-800 hidden sm:flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-violet-400" />
            <span>Click and drag nodes to interact with physics. Click a node to view connected memories.</span>
          </div>
        </div>
      </div>

      {/* Interactive Physics Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Node Inspector Side Drawer (When Node is Clicked) */}
      {selectedNode && (
        <div className="absolute top-20 right-4 bottom-4 z-30 w-80 sm:w-96 p-4 rounded-3xl bg-[#11111A]/95 border border-violet-500/30 shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-y-auto space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                style={{ backgroundColor: NODE_COLORS[selectedNode.type].bg }}
              >
                {selectedNode.type === 'person' && <Users className="w-4 h-4" />}
                {selectedNode.type === 'memory' && <Sparkles className="w-4 h-4" />}
                {selectedNode.type === 'place' && <MapPin className="w-4 h-4" />}
                {selectedNode.type === 'event' && <Award className="w-4 h-4" />}
                {selectedNode.type === 'date' && <Calendar className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#0A0A0F] text-slate-300 border border-slate-800">
                  {selectedNode.type} Node
                </span>
                <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                  {selectedNode.label}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details for Memory Node */}
          {connectedDetails?.memory && (
            <div className="space-y-3 pt-2">
              {connectedDetails.memory.photos?.[0] && (
                <img
                  src={connectedDetails.memory.photos[0]}
                  alt={connectedDetails.memory.title}
                  className="w-full h-36 rounded-2xl object-cover ring-1 ring-violet-500/30"
                />
              )}
              <div className="p-3 rounded-xl bg-[#0A0A0F] border border-slate-800 text-xs text-slate-300 italic">
                “{connectedDetails.memory.story}”
              </div>
              <div className="text-xs space-y-1 text-slate-400">
                <p>📍 {connectedDetails.memory.location.placeName}, {connectedDetails.memory.location.city}</p>
                <p>📅 {connectedDetails.memory.date}</p>
                <p>🏷️ {connectedDetails.memory.tags.join(', ')}</p>
              </div>
              <button
                onClick={() => onSelectMemory(connectedDetails.memory!)}
                className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1"
              >
                <span>Open Full Memory Card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Details for Person Node */}
          {connectedDetails?.person && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0A0A0F] border border-slate-800">
                <img
                  src={connectedDetails.person.avatar}
                  alt={connectedDetails.person.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-violet-500/40"
                />
                <div>
                  <p className="text-xs font-bold text-white">{connectedDetails.person.name}</p>
                  <p className="text-[11px] text-violet-300">{connectedDetails.person.relation}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{connectedDetails.person.bio}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-300">Connected Memories ({connectedDetails.connectedMemories?.length})</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {connectedDetails.connectedMemories?.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => onSelectMemory(m)}
                      className="w-full text-left p-2.5 rounded-xl bg-[#0A0A0F] hover:bg-violet-600/20 border border-slate-800 text-xs transition-colors flex items-center justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white truncate">{m.title}</p>
                        <p className="text-[10px] text-slate-400">📍 {m.location.city} • {m.date}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-violet-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Details for Place Node */}
          {connectedDetails?.cityName && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                All memories recorded in <strong className="text-white">{connectedDetails.cityName}</strong> ({connectedDetails.connectedMemories?.length}):
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {connectedDetails.connectedMemories?.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelectMemory(m)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#0A0A0F] hover:bg-emerald-600/20 border border-slate-800 text-xs transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white truncate">{m.title}</p>
                      <p className="text-[10px] text-slate-400">📅 {m.date} • {m.category}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
