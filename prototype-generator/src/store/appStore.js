import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Global App State Management with Zustand
 */
export const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        // UI State
        currentMode: 'idle', // 'idle' | 'brainstorming' | 'ideafinder'
        currentPhase: 'input', // varies by mode
        isLoading: false,
        error: null,
        toast: null,

        // Session
        session: {
          id: '',
          startTime: null,
          status: 'active', // 'active' | 'completed'
        },

        // Brainstorming State
        brainstorming: {
          topic: '',
          chatHistory: [],
          iterations: 0,
          prdData: null,
          prototypeData: null,
          prdIterations: 0,
          prototypeIterations: 0,
        },

        // Ideafinder State
        ideafinder: {
          topic: '',
          generatedIdeas: [],
          selectedIdea: null,
          chatHistory: [],
          iterations: 0,
          prdData: null,
          prototypeData: null,
          prdIterations: 0,
          prototypeIterations: 0,
        },

        // Actions
        setMode: (mode) => set({ currentMode: mode }),
        setPhase: (phase) => set({ currentPhase: phase }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        setToast: (toast) => set({ toast }),

        // Session Actions
        startSession: (mode, topic) =>
          set({
            session: {
              id: Math.random().toString(36).substring(7),
              startTime: new Date(),
              status: 'active',
            },
            currentMode: mode,
          }),

        completeSession: () =>
          set((state) => ({
            session: { ...state.session, status: 'completed' },
          })),

        // Brainstorming Actions
        setBrainstormingTopic: (topic) =>
          set((state) => ({
            brainstorming: { ...state.brainstorming, topic },
          })),

        addBrainstormingMessage: (sender, message) =>
          set((state) => ({
            brainstorming: {
              ...state.brainstorming,
              chatHistory: [
                ...state.brainstorming.chatHistory,
                { sender, message, timestamp: new Date() },
              ],
            },
          })),

        setPRDData: (prdData) =>
          set((state) => ({
            brainstorming: { ...state.brainstorming, prdData },
          })),

        setPrototypeData: (prototypeData) =>
          set((state) => ({
            brainstorming: { ...state.brainstorming, prototypeData },
          })),

        incrementBrainstormingIterations: () =>
          set((state) => ({
            brainstorming: {
              ...state.brainstorming,
              iterations: state.brainstorming.iterations + 1,
            },
          })),

        // Ideafinder Actions
        setIdefinderTopic: (topic) =>
          set((state) => ({
            ideafinder: { ...state.ideafinder, topic },
          })),

        setGeneratedIdeas: (ideas) =>
          set((state) => ({
            ideafinder: { ...state.ideafinder, generatedIdeas: ideas },
          })),

        selectIdea: (idea) =>
          set((state) => ({
            ideafinder: { ...state.ideafinder, selectedIdea: idea },
          })),

        addIdefinderMessage: (sender, message) =>
          set((state) => ({
            ideafinder: {
              ...state.ideafinder,
              chatHistory: [
                ...state.ideafinder.chatHistory,
                { sender, message, timestamp: new Date() },
              ],
            },
          })),

        setIdefinderPRDData: (prdData) =>
          set((state) => ({
            ideafinder: { ...state.ideafinder, prdData },
          })),

        setIdefinderPrototypeData: (prototypeData) =>
          set((state) => ({
            ideafinder: { ...state.ideafinder, prototypeData },
          })),

        // Reset
        reset: () =>
          set({
            currentMode: 'idle',
            currentPhase: 'input',
            isLoading: false,
            error: null,
            brainstorming: {
              topic: '',
              chatHistory: [],
              iterations: 0,
              prdData: null,
              prototypeData: null,
              prdIterations: 0,
              prototypeIterations: 0,
            },
            ideafinder: {
              topic: '',
              generatedIdeas: [],
              selectedIdea: null,
              chatHistory: [],
              iterations: 0,
              prdData: null,
              prototypeData: null,
              prdIterations: 0,
              prototypeIterations: 0,
            },
          }),
      }),
      {
        name: 'prototype-generator',
        partialize: (state) => ({
          brainstorming: state.brainstorming,
          ideafinder: state.ideafinder,
          session: state.session,
        }),
      }
    )
  )
);
