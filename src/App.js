import React, {useState,useRef, useEffect} from 'react';
import {createStore} from 'redux';
import {Provider, useSelector,useDispatch} from 'react-redux';
const allFields = [];
const useForm2 = callback => {
  let fields; 
  const [values, setValues] = useState({});
  const name = useRef('');
  function register(input, ref) {
    if (!input) return;
    if (allFields.filter(item => item === input.name).length > 0) return;
    allFields.push(input.name);
    name.current = input.name;
    fields = ref;
    input.addEventListener("change", e => {
        setValues({
          [e.target.name]: e.target.value
        });
    });
    return ref
  }
  // useEffect(() => {
  //   fields.current = {
  //     [name]: values[name],
  //   }
  // }, [values])
  function submitHandler() {
    callback(values);
  }
  return {
    register,
    submitHandler,
    // getFiledValue
  };
};
const useForm1 = (callback) => {
  const [inputs, setInputs] = useState({});
  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
  }
  const handleInputChange = (event) => {
    event.persist();
    setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
  }
  return {
    handleSubmit,
    handleInputChange,
    inputs
  };
}
function reducer(state={text: ''}, action){
  if(action.type === 'changeText'){
    return {
      text: action.payload
    }
  }
  return state;
}
const Form = ()=>{
  console.log("render redux form");
  const dispatch = useDispatch();
  const text = useSelector(store => store.text)
  return (
    <form>
          <label>text: </label>
          <input
          onChange={(e)=>dispatch({type: 'changeText', payload: e.target.value})} type="text" value={text}></input>
          <div>{text}</div>
        </form>
  )
}
const HookForm = ()=>{
  console.log("render custom hook form")
  const {inputs,handleInputChange} = useForm1();
  return (
    <form>
      <label>text: </label>
      <input onChange={handleInputChange} type="text" name="firstName" value={inputs.firstName}></input>
      <div>{inputs.firstName}</div>
    </form>
  )
}
const RefForm = ()=>{
  const ref = useRef(null);
  console.log("render ref hook form")
  const { register} = useForm2();
  console.log(ref)
  return (
    <form>
      <label>text: </label>
      <input ref={(e)=>register(e, ref)} type="text" name="firstName"></input>
      <div>{JSON.stringify(ref)}</div>
    </form>
  )
}

function ReduxForm() {
  const store = createStore(reducer);

  return (
    <Provider store={store}>
      <div className="App">
        <Form/>
      </div>
    </Provider>
    
  );
}


function App() {
  return (
    <div className="App">
      <ReduxForm/>
      <HookForm/>
      <RefForm/>
    </div>
  );
}

export default App;
