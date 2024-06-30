import * as React from "react";
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
const List=({list, onRemoveItem})=>{
console.log('List render')
return(
  <ul>{list.map((e)=>(
    <Item key={e.objectID} e={e} onRemoveItem={onRemoveItem}/>
 
    
  ))}</ul>
)

  }
const Item =({e, onRemoveItem})=>{
  console.log('Item render')
  return(
  <li >
  <span>
       <a href={e.url}>{e.title}</a>
   </span>
   <span>{e.author}</span>
   <span>{e.num_comment}</span>
   <span>{e.points}</span>
   <span>
    <button type="button" onClick={()=> onRemoveItem(e)}> Dismiss</button>
   </span>
</li>
  )
};

const App=()=>{
  const initialStories=[{title:"react",url:"https://reactjs.org/",author:"Joedan Walke",num_comment:3, points:4,objectID:0},
{title:"redux",url:"https://redux.js.org/",author:"Dan Abramov, Andrew clarck",num_comment:2, points:5,objectID:1}];
const [isLoading, setIsLoading]= React.useState(false);
const [isError, setIsError] = React.useState(false);
const [stories, setStories]=React.useState(initialStories);
const [searchTerm, setSearchTerm]=React.useState(
  localStorage.getItem('search') || 'React'
);
const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
const handleSearchSubmit = () => {
setUrl(`${API_ENDPOINT}${searchTerm}`);
};
const handleRemoveStory=(e)=>{
  const newStories=stories.filter(
    (story)=>e.objectID!==story.objectID
  )
  setStories(newStories);
}
React.useEffect(()=>{
  if(!searchTerm) return;
  setIsLoading(true);
  fetch(url)
  .then((response)=> response.json())
  .then((result)=>{
    setIsLoading(false)
    setStories(result.hits)
  })
  .catch(()=>{
    setIsLoading(false);
    setIsError(true);
  })
  localStorage.setItem('search', searchTerm)
}, [url]);
const handleSearch=(event)=>{
  setSearchTerm(event.target.value);

}
console.log('App renders')

return(

  
    <div>
    <h1>My hacker stories</h1>
    <InputWithLabel id="search" onInputChange={handleSearch} value={searchTerm}>
     <strong>search:</strong>
    </InputWithLabel>
    <hr />
    <button
type="button"
disabled={!searchTerm}
onClick={handleSearchSubmit}
>
Submit
</button>
    {isError && <p>Something went wrong ...</p>}
    {isLoading ?(<p>loading...</p>):(<List  list={stories} onRemoveItem={handleRemoveStory}/>)}
    </div>
);
  
}
const InputWithLabel =({id, value, onInputChange, type="text", children})=>(
  <>
    <label htmlFor={id}>{children} </label>
    &nbsp;
    <input type={type} id={id}  onChange={onInputChange} value={value}/>
  </>
)
export default App;

