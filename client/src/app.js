import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import shortid from 'shortid';

function App() {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const local = true;

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ["websocket"] });
    setSocket(socket);
    socket.on('updateData', (tasks) => updateData(tasks));
    socket.on('addTask', (task) => addTask(task));
    socket.on('removeTask', (id) => removeTask(id));
  }, []);

  const updateData = list => {
    setTasks(list);
  };

  const removeTask = (id, local) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    if(local){
      socket.emit('removeTask', id);
    };
  };

  const submitForm = (event) => {
    event.preventDefault();
    addTask({ id: shortid(), name: taskName });
    socket.emit('addTask', { id: shortid(), name: taskName });
  };

  const addTask = task => {
    setTasks(tasks => [...tasks, task]);
    setTaskName('');
  };

  return (
    <div className="App">
      
    <header>
      <h1>ToDoList.app</h1>
    </header>

    <section className="tasks-section" id="tasks-section">
      <h2>Tasks</h2>

      <ul className="tasks-section__list" id="tasks-list">
        {tasks.map((task)=> (<li className='task' key={task.id}>
          {task.name}
          <button className='btn btn--red' 
          onClick={()=>removeTask(task.id)}>
            Remove
          </button>
        </li>))}
      </ul>

      <form id="add-task-form" onSubmit={e => submitForm(e)}>
        <input 
        className="text-input" 
        autocomplete="off" 
        type="text" 
        placeholder="Type your description" 
        id="task-name"
        value={taskName}
        onChange={e => setTaskName(e.target.value)}/>
        <button className="btn" type="submit">Add</button>
      </form>

    </section>
    </div>
  );
}

export default App;