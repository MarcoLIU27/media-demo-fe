import React from 'react';
import Autosuggest from 'react-autosuggest';

// Data List

const people = [{"parentName":"Annalena Baerbock","parentPresent":"Annalena Baerbock (安娜莱娜·贝尔伯克)","encodedParentName":"Annalena%20Baerbock","shortBio":"German politician (born 1980)"},{"parentName":"刘永灼","parentPresent":"刘永灼","encodedParentName":"%E5%88%98%E6%B0%B8%E7%81%BC","shortBio":"恒大集团常务副总裁"},{"parentName":"张近东","parentPresent":"张近东","encodedParentName":"%E5%BC%A0%E8%BF%91%E4%B8%9C","shortBio":"苏宁控股集团名誉董事长"},{"parentName":"朱华晨","parentPresent":"朱华晨 (Huachen Zhu)","encodedParentName":"%E6%9C%B1%E5%8D%8E%E6%99%A8","shortBio":"香港学者"},{"parentName":"李华林1","parentPresent":"李华林","encodedParentName":"%E6%9D%8E%E5%8D%8E%E6%9E%971","shortBio":"原中国石油天然气集团公司副总经理"},{"parentName":"李斌1","parentPresent":"李斌","encodedParentName":"%E6%9D%8E%E6%96%8C1","shortBio":"第十九届中央委员，第十三届全国政协副主席、秘书长，中国宋庆龄基金会理事会主席"},{"parentName":"李斌3","parentPresent":"李斌","encodedParentName":"%E6%9D%8E%E6%96%8C3","shortBio":"蔚来创始人、董事长、CEO"},{"parentName":"梁建章","parentPresent":"梁建章","encodedParentName":"%E6%A2%81%E5%BB%BA%E7%AB%A0","shortBio":"携程集团创始人、北京大学光华管理学院教授"},{"parentName":"童朝晖","parentPresent":"童朝晖","encodedParentName":"%E7%AB%A5%E6%9C%9D%E6%99%96","shortBio":"北京市呼吸疾病研究所所长"},{"parentName":"马兴瑞","parentPresent":"马兴瑞","encodedParentName":"%E9%A9%AC%E5%85%B4%E7%91%9E","shortBio":"中央政治局委员，新疆维吾尔自治区党委书记，新疆生产建设兵团第一政委"}];

// async function getAllPeopleData() {
//     // 使用parent_present,从mongodb获取所有备选选项(parentName, parentPresent, encodedParentName, shortBio) pairs
//     const allPeople = await fetch(`http://localhost:9000/api/people`); // 先返回所有people
//     const people = await allPeople.json();
//   console.log(people);
//   console.log(people1);
//     return people;
// };
  
// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim();
  const inputLength = inputValue.length;

  //const people = getAllPeopleData();

  return inputLength === 0 ? [] : people.filter(person =>
    person.parentPresent.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.parentPresent;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div className="suggestion-container">
    <p className="parent-present">{suggestion.parentPresent}</p>
    <p className="short-bio">{suggestion.shortBio}</p>
  </div>
);

export default class SearchBox extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
  }
  
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
    
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  suggestionSelected = (event, { suggestion }) => {
    this.props.onSelected(suggestion.parentName, suggestion.parentPresent);
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={this.suggestionSelected}
      />
    );
  }
}

// import React, { useState } from "react";
// import Autosuggest from "react-autosuggest";


//   const getSuggestions = async (value) => {
//     // 使用parent_present,从mongodb获取所有备选选项(name, present, short_bio) pairs
//     const response = await fetch(`/api/people/searchName?q=${value}`);
//     const data = await response.json();
//     return data.results;
//   };

//   const getSuggestionValue = (suggestion) => suggestion.name;

//   const renderSuggestion = (suggestion) => (<div>{suggestion.name}</div>);

//   class SearchBox extends React.Component {
//     constructor() {
//       super();
  
//       // Autosuggest is a controlled component.
//       // This means that you need to provide an input value
//       // and an onChange handler that updates this value (see below).
//       // Suggestions also need to be provided to the Autosuggest,
//       // and they are initially empty because the Autosuggest is closed.
//       this.state = {
//         value: '',
//         suggestions: []
//       };
//     }
  
//     onChange = (event, { newValue }) => {
//       this.setState({
//         value: newValue
//       });
//     };
  
//     // Autosuggest will call this function every time you need to update suggestions.
//     // You already implemented this logic above, so just use it.
//     onSuggestionsFetchRequested = ({ value }) => {
//       this.setState({
//         suggestions: getSuggestions(value)
//       });
//     };
  
//     // Autosuggest will call this function every time you need to clear suggestions.
//     onSuggestionsClearRequested = () => {
//       this.setState({
//         suggestions: []
//       });
//     };
  
//     render() {
//       const { value, suggestions } = this.state;
  
//       // Autosuggest will pass through all these props to the input.
//       const inputProps = {
//         placeholder: 'Type a programming language',
//         value,
//         onChange: this.onChange
//       };
  
//       // Finally, render it!
//       return (
//         <Autosuggest
//           suggestions={suggestions}
//           onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
//           onSuggestionsClearRequested={this.onSuggestionsClearRequested}
//           getSuggestionValue={getSuggestionValue}
//           renderSuggestion={renderSuggestion}
//           inputProps={inputProps}
//         />
//       );
//     }
//   }

// export default SearchBox;
