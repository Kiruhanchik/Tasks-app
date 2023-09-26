import React, { useState, useEffect } from 'react';
import './App.css';
import del from './img/delete.png';
import edit from './img/edit.png';
import done from './img/done.png';
 
function App() {
  if ('Notification' in window) {
    console.log('Notifications on');
    Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        console.log('Agree')
      } else {
        console.log('Disagree')
      }
    });
  } else {
    console.log('Notifications off');
  }
  
  const [tasks, setTasks] = useState(() => {
    if (localStorage.getItem('tasks') === null) {
      return [];
    }
    return JSON.parse(localStorage.getItem('tasks'));
  });

  useEffect(() => {
    if (localStorage.getItem('tasks')) {
      setTasks(JSON.parse(localStorage.getItem('tasks')));
    }
  }, []);

  const sortByTime = () => {
    const sortedTasks = tasks.sort((a, b) => {
      const timeA = new Date(`${a.date} ${a.time}`).getTime();
      const timeB = new Date(`${b.date} ${b.time}`).getTime();
      return timeA - timeB;
    });
    setTasks([...sortedTasks]);
  };

  const showNotification = (task) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification('Пришло время задачи', {
        body: `Не забудьте: ${task.name}`,
      }); 
  
      notification.onclick = function (event) {
        event.preventDefault();
      };
    }
  };

  const addTask = async () => {
    if (
      document.getElementById('name-task').value !== '' &&
      document.getElementById('desk-task').value !== '' &&
      document.getElementById('time-task').value !== '' &&
      document.getElementById('date-task').value !== ''
    ) {
      const nameTask = document.getElementById('name-task').value;
      const descriptionTask = document.getElementById('desk-task').value;
      const timeTask = document.getElementById('time-task').value;
      const dateTask = document.getElementById('date-task').value;
  
      const newTask = {
        name: nameTask,
        description: descriptionTask,
        time: timeTask,
        date: dateTask,
        id: tasks.length,
      };
  
      setTasks([...tasks, newTask]); // добавляю новую заметку в массив
      document.getElementById('name-task').value = '';
      document.getElementById('desk-task').value = '';
      document.getElementById('time-task').value = '';
      document.getElementById('date-task').value = '';
  
      if (Notification.permission === 'granted') {
        const notification = new Notification('Вы создали задачу', {
          body: `Название: ${newTask.name}\nВремя: ${newTask.time}`,
        });
      }
  
      let timer = setInterval(() => {
        // получаем текущее время
        const currentTime = `${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date().getDate()}`;
        const taskTime = `${newTask.time} ${newTask.date}`;
        if (currentTime === taskTime) {
          showNotification(newTask);
          clearInterval(timer);
        }
      }, 1000);
  
    } else {
      alert('Заполните все поля!');
    }
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  }

  const doneTask = (el) => {
    if (el.target.parentNode.parentNode.style.borderColor === 'green') {
      el.target.parentNode.parentNode.style.borderColor = 'black';
      el.target.parentNode.parentNode.style.background = 'linear-gradient(90deg, #f45c0b 0%, #d8ca0b 100%)';
    } else {
      el.target.parentNode.parentNode.style.borderColor = 'green';
      el.target.parentNode.parentNode.style.background = 'linear-gradient(90deg, #73bf2c 0%, #65e0e9ec 100%)';
    }
  }


  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const renderTasks = () => {
    if (tasks.length === 0) {
      return <p id='none'>You don`t have any tasks 😞</p>;
    } else {
      return tasks.map(task => (
        <div id='task' key={task.id}>
          <p id='name'>{task.name}</p>
          <p id='description'>{task.description}</p>
          <p id='time'>{task.time}</p>
          <p id='date'>{task.date}</p>
          <div id='params'>
            <img id='edit' src={edit} alt="" />
            <img id='delete' src={del} alt="" onClick={() => deleteTask(task.id)}/>
            <img id='done' src={done} alt="" onClick={doneTask}/>
          </div>
        </div>
      ));
    }
  };

  return (
    <div className="App">
      <header>Tasklist by Kiruhanchik</header>
      <main>
        {renderTasks()}
        <input type="text" id='name-task' placeholder='Write name of task'/>
        <input type="text" id='desk-task' placeholder='Write description of task'/>
        <input type="time" id='time-task'/>
        <input type="date" id='date-task'/>
        <button onClick={sortByTime} id='sort'>По сроку выполнения</button>
        <button onClick={addTask} id='add'>Create</button>
      </main>
    </div>
  );
}

export default App;