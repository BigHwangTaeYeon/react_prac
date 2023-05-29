import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function Update(props) {
  const [title,setTitle] = useState(props.title);
  const [body,setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title,body)
    }}>
    <p><input type='text' name='title' placeholder='title' value={title} onChange={event=>{
      setTitle(event.target.value);
    }}></input></p>
    <p><textarea name='body' placeholder='body' value={body} onChange={event=>{
      setBody(event.target.value);
    }}></textarea></p>
    <p><input type='submit' value='Update'></input></p>
    </form>
  </article>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value; // name이 title인 value값을 가져온다
      const body = event.target.body.value; // name이 title인 value값을 가져온다
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder='title'></input></p>
      <p><textarea name='body' placeholder='body'></textarea></p>
      <p><input type='submit' value='Create'></input></p>
    </form>
  </article>
}

function Header(props){
  return <header>
    <h1><a href="/" onClick={(event)=> {
      event.preventDefault(); // 클릭해도 리로드가 이루어지지 않음
      props.onChangeMode();   // title 처럼 onChangeMode 함수 호출
    }}>{props.title}</a></h1>
  </header>
}

function Nav(props){
  const lis = []
  
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={(event)=> {
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));  // target 은 event를 발생시킨 태그를 가리키며 태그의 속성 중, id 값을 가져온다.
      }}>{t.title}</a>
    </li>)
  }

  return <nav> 
    <ol>
      {lis}
    </ol>
  </nav>
}

function Article(props){
  return <article> 
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function App() {
  // const _mode = useState('WELCOME');
  // const mode = _mode[0];    // mode 값
  // const setMode = _mode[1]; // mode 값 변경
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id : 1, title : 'html', body : 'html is..'},
    {id : 2, title : 'css', body : 'css is..'},
    {id : 3, title : 'javaScript', body : 'javaScript is..'}
  ])
  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li>
        <a href={'/update/' + id} onClick={event=>{
          event.preventDefault();
          setMode('UPDATE');
        }}>update</a>
      </li>
      <li>
        <input type='button' value='Delete' onClick={()=>{
          const newTopics = []
          for(let i=0; i<topics.length; i++){
            if(topics[i].id !== id){
              newTopics.push(topics[i]);
            }
          }
          setTopics(newTopics);
          setMode('WELCOME');
        }}></input>
      </li>
    </>
  } else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}

      // topics.push(newTopic); // 기존 리스트에 넣고
      // setTopics(topics)      // 기존 리스트를 렌더링
      // 리엑트는 같은 데이터라면 컴포넌트를 다시 실행하지 않음
      // 기존 데이터에 넣고 set하면 똑같은 것으로 판단한다
      const newTopics = [...topics];  
      newTopics.push(newTopic);
      setTopics(newTopics);
      // 그래서 새로 변수를 만들어 기존 데이터를 ...을 붙여 복제하고 복제한 데이터를 변경하여 set 정상적으로 실행하면 된다 
      // 그냥 문법이라 생각하자
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if (mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }

  return (
    <div>
      <Header title="WEB" onChangeMode={()=> {
        setMode('WELCOME');
      }}>
      </Header>
      <Nav topics={topics} onChangeMode={(_id)=> {
        setMode('READ');
        setId(_id);
      }}>
      </Nav>
      {content}
      <ul>
        <li>
          <a href="/create" onClick={event=>{
            event.preventDefault();
            setMode('CREATE');
          }}>Create</a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
