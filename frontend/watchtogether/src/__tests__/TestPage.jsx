/**
 * ============================================
 * TEST PAGE ROUTER
 * ============================================
 * 
 * Navigation để chạy các test cases
 * 
 * File: src/__tests__/TestPage.jsx
 * Folder: src/__tests__/
 */

import { useState } from 'react';
import WebSocketConnectionTest from './unit/WebSocketConnection.test';
import VideoSyncEventsTest from './unit/VideoSyncEvents.test';
import InitialStateSyncTest from './unit/InitialStateSync.test';
import FullSyncFlowTest from './integration/FullSyncFlow.test';
import ReactPlayerTest from './unit/ReactPlayerTest';

export default function TestPage() {
    const [activeTest, setActiveTest] = useState('react-player');

    const tests = [
        {
            id: 'react-player',
            name: 'Test 0: ReactPlayer + WebSocket',
            description: '🎬 Test ReactPlayer với YouTube, Vimeo, MP4',
            component: ReactPlayerTest,
            folder: 'unit',
        },
        {
            id: 'connection',
            name: 'Test 1: WebSocket Connection',
            description: 'Test kết nối WebSocket và JWT authentication',
            component: WebSocketConnectionTest,
            folder: 'unit',
        },
        {
            id: 'events',
            name: 'Test 2: Video Sync Events',
            description: 'Test gửi/nhận video events (PLAY/PAUSE/SEEK/CHANGE)',
            component: VideoSyncEventsTest,
            folder: 'unit',
        },
        {
            id: 'initial-sync',
            name: 'Test 3: Initial State Sync',
            description: 'Test user mới join nhận state từ Redis',
            component: InitialStateSyncTest,
            folder: 'unit',
        },
        {
            id: 'integration',
            name: 'Test 4: Full Integration',
            description: 'Test toàn bộ flow với multiple clients',
            component: FullSyncFlowTest,
            folder: 'integration',
        },
    ];

    const currentTest = tests.find(t => t.id === activeTest);
    const TestComponent = currentTest?.component;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        🧪 WatchTogether - Test Suite
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Frontend tests cho Video Sync Module
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Test Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-4 sticky top-6">
                            <h2 className="font-semibold mb-4">Test Cases</h2>
                            <nav className="space-y-2">
                                {tests.map(test => (
                                    <button
                                        key={test.id}
                                        onClick={() => setActiveTest(test.id)}
                                        className={`w-full text-left px-3 py-2 rounded transition-colors ${activeTest === test.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <div className="font-medium text-sm">{test.name}</div>
                                        <div className={`text-xs mt-1 ${activeTest === test.id ? 'text-blue-100' : 'text-gray-500'
                                            }`}>
                                            {test.folder}
                                        </div>
                                    </button>
                                ))}
                            </nav>

                            {/* Info Box */}
                            <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <h3 className="font-semibold text-sm mb-2">⚠️ Prerequisites</h3>
                                <ul className="text-xs space-y-1">
                                    <li>• Backend server running</li>
                                    <li>• Redis server running</li>
                                    <li>• Valid JWT cookie</li>
                                    <li>• Room created (for tests)</li>
                                </ul>
                            </div>

                            {/* Folder Structure */}
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-sm mb-2">📁 Folder Structure</h3>
                                <pre className="text-xs font-mono">
                                    {`src/
  __tests__/
    unit/
      WebSocketConnection.test.jsx
      VideoSyncEvents.test.jsx
      InitialStateSync.test.jsx
    integration/
      FullSyncFlow.test.jsx
    TestPage.jsx (this file)`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Test Component */}
                    <div className="lg:col-span-3">
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h2 className="text-xl font-semibold mb-2">
                                {currentTest?.name}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {currentTest?.description}
                            </p>
                            <div className="mt-2">
                                <span className="inline-block px-2 py-1 text-xs bg-gray-200 rounded">
                                    Folder: src/__tests__/{currentTest?.folder}/
                                </span>
                            </div>
                        </div>

                        {TestComponent && <TestComponent />}
                    </div>
                </div>
            </div>
        </div>
    );
}
