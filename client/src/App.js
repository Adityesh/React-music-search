import React from 'react';
import './App.css';
import ReactAudioPlayer from 'react-audio-player';

class App extends React.Component {

  constructor(props) {
    super(props)
  }

  state = {
    isLoading : true,
    input : '',
    searchRes : [],
    error : false,
  }

  handleChange = (e) => {
    this.setState({
      input : e.target.value
    })
  }

  fetchData = async () => {
    const {input} = this.state;
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({search : input})
  }
    const result = await fetch('http://localhost:5000/scrape',options)
    const data = await result.json();
    if(data.error) {
      this.setState({
        searchRes : [],
        isLoading : false,
        error : true
      })
    } else {
      this.setState({
        searchRes : data.result,
        isLoading : false,
        error : false
      })
    }
    
  }

  render() {
    return (
      <div>
            <input type='text' placeholder='Enter artist or song...' name='search' onChange={this.handleChange} value={this.state.input}/>
            <input type='submit' value='Search' onClick={this.fetchData}/>
            <div className="content">
                {this.state.isLoading && (this.state.error === false) ? <span> Search for any song or artist </span> : this.state.searchRes.map((element, key) => {
                  return (
                    <div className="audio" key={key}>
                      <h1 className="left">{element.title}</h1>
                      
                      <div className="right">
                      <ReactAudioPlayer src={element.url} controls preload='true'/>
                        <button className="btn">
                        <a href={element.url} download><i className="fa fa-download"></i></a>
                        </button>
                      
                        
                      </div>
                      
                  </div>
                  )
                  
                })}

            </div>
      </div>

      
    );
  }
  
}

export default App;
