import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null,
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
    },
    updateTaskInState: (state, action) => {
      const taskId = action.payload._id || action.payload.id;
      const index = state.tasks.findIndex((t) => (t._id || t.id) === taskId);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      const selectedId = state.selectedTask?._id || state.selectedTask?.id;
      if (selectedId === taskId) {
        state.selectedTask = action.payload;
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => (t._id || t.id) !== action.payload);
      const selectedId = state.selectedTask?._id || state.selectedTask?.id;
      if (selectedId === action.payload) {
        state.selectedTask = null;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
  },
});

export const { 
  setTasks, 
  addTask, 
  updateTaskInState, 
  removeTask, 
  setLoading, 
  setError, 
  selectTask, 
  clearSelectedTask 
} = taskSlice.actions;
export default taskSlice.reducer;
