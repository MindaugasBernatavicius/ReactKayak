import React, {useState, useEffect} from "react";
import './App.css';

// TODO :: https://gist.github.com/MindaugasBernatavicius/9783d19777c7ba0d2f5ce78a9cabe847
// ... the resize could be made a bit prettier with the above example, I think

// Ref: https://github.com/uiacademy/homework

const $ = (selector) => document.getElementById(selector);
Object.defineProperty(HTMLElement.prototype, 'bgColor', {
    // You can't replace this with an arrow function
    // due to 'this' not being available in arrow functions
    // see here: https://stackoverflow.com/q/49656646/1964707
    set: function setBackgroundColor(color) {
        this.style.backgroundColor = color;
    }
});

const AutoForm = p => {
    const resize = () => {
        // since we use this function to trigger sibling resize,
        // which will in turn resize the window
        window.removeEventListener('resize', resize);
        const offsetLeft = document.getElementById('input').offsetLeft;
        const offsetChildBottom = document.getElementById('input').offsetTop
            + document.getElementById('input').offsetHeight - 1;
        const offsetWidth = document.getElementById('input').offsetWidth - 1.5;
        p.getSiblingPossition({offsetLeft, offsetChildBottom, offsetWidth});
    };

    // ref: https://medium.com/@timtan93/states-and-componentdidmount-in-functional-components-with-hooks-cac5484d22ad
    // empty array makes it so that the effect is run and cleaned up when the component mounts / unmounts.
    useEffect(() => resize(), []);

    // ref: https://app.pluralsight.com/guides/re-render-react-component-on-window-resize
    window.addEventListener('resize', resize);

    return (
        <form style={{textAlign: 'center'}}>
            <p style={{display: 'inline-block', paddingRight: 5}}>Which movie would you like to look up:</p>
            <input style={{border: '1px solid Gray'}} autoComplete="off" id="input" type="text" onChange={p.filterSuggs}/>
        </form>
    )
};

const AutoDropdown = p => {
    // ref: https://codesandbox.io/s/8lyp733pj0
    let suggestionsListComponent;
    let st = {
        border: '1px solid Gray',
        position: 'absolute',
        left: p.sibPos.offsetLeft,
        top: p.sibPos.offsetChildBottom,
        width: p.sibPos.offsetWidth
    };
    if (p.filteredSuggestions.length > 0) {
        suggestionsListComponent = (
            <div style={st}>{
                p.filteredSuggestions.map((sugg, idx) =>
                    <p key={idx} id={`sugg-${idx}`} style={{margin: '0', border: '1px solid Gray'}}
                       onMouseOver={() => {$(`sugg-${idx}`).bgColor = "lightblue"}}
                       onMouseOut={() => {$(`sugg-${idx}`).bgColor = "white"}}>
                        {sugg.title}
                    </p>)
            }</div>
        );
    } else if (p.enteredCharCount > 3) {
        suggestionsListComponent = (
            <div style={st}>
                <p style={{margin: '0'}}>No suggestions!</p>
            </div>
        );
    } else {
        suggestionsListComponent = (<></>);
    }
    return suggestionsListComponent;
};

const App = () => {
    const apiKey = '2033a9256b37682a65df143afe7c9cc0';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=`;
    const [sibPos, setSiblPos] = useState({});
    const [suggs, setSuggs] = useState([]);
    const [usersInputLength, setUsersInputLength] = useState(0);
    const getChildInputLeftPadding = (e) => setSiblPos(e);
    const filterSuggs = (e) => {
        if (e.target.value.length >= 3)
            fetch(url + e.target.value)
                .then(res => res.json())
                .then(data => setSuggs(data.results));
        else
            setSuggs([]);
        setUsersInputLength(e.target.value.length);
    };
    return (<>
        <AutoForm filterSuggs={filterSuggs} getSiblingPossition={getChildInputLeftPadding}/>
        <AutoDropdown filteredSuggestions={suggs} enteredCharCount={usersInputLength} sibPos={sibPos}/>
    </>);
};

export default App;