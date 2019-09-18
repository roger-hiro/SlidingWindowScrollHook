import React from "react";
const THRESHOLD = 15;
class SlidingWindowScroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      end: THRESHOLD
    };
    this.$bottomElement = React.createRef();
    this.$topElement = React.createRef();
  }

  componentDidMount() {
    this.intiateScrollObserver();
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.end !== this.state.end) || (prevState.start !== this.state.start)) {
      this.intiateScrollObserver();
    }
  }

  intiateScrollObserver = () => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    this.observer = new IntersectionObserver(this.callback, options);
    
    if (this.$topElement.current) {
      this.observer.observe(this.$topElement.current);
    }
    if (this.$bottomElement.current) {
      this.observer.observe(this.$bottomElement.current);
    }
  }

  callback = (entries, observer) => {
    entries.forEach((entry, index) => {
      const listLength = this.props.list.length;
      const {start, end} = this.state;
      // Scroll Down
      // We make increments and decrements in 10s
      if (entry.isIntersecting && entry.target.id === "bottom") {
        const maxStartIndex = listLength - 1 - THRESHOLD;     // Maximum index value `start` can take
        const maxEndIndex = listLength - 1;                   // Maximum index value `end` can take
        const newEnd = (end + 10) <= maxEndIndex ? end + 10 : maxEndIndex;
        const newStart = (end - 5) <= maxStartIndex ? end - 5 : maxStartIndex;
        this.updateState(newStart, newEnd);
      }
      // Scroll up
      if (entry.isIntersecting && entry.target.id === "top") {
        const newEnd = end === THRESHOLD ? THRESHOLD : (end - 10 > THRESHOLD ? end - 10 : THRESHOLD);
        let newStart = start === 0 ? 0 : (start - 10 > 0 ? start - 10 : 0);
        this.updateState(newStart, newEnd);
      }
    });
  }

  resetObservation = () => {
    this.observer.unobserve(this.$bottomElement.current);
    this.observer.unobserve(this.$topElement.current);
    this.$bottomElement = React.createRef();
    this.$topElement = React.createRef();
  }

  updateState = (newStart, newEnd) => {
    const {start, end} = this.state;
    if (start !== newStart || end !== newEnd) {
      this.resetObservation();
      this.setState({
        start: newStart,
        end: newEnd
      });
    }
  }

  getReference = (index, isLastIndex) => {
    if (index === 0)
      return this.$topElement;
    if (isLastIndex) 
      return this.$bottomElement;
    return null;
  }

  render() {
    const {list, height} = this.props;
    const {start, end} = this.state;
    const updatedList = list.slice(start, end);
    const lastIndex = updatedList.length - 1;
    return (
      <ul style={{position: 'relative'}}>
        {updatedList.map((item, index) => {
          const top = (height * (index + start)) + 'px';
          const refVal = this.getReference(index, index === lastIndex);
          const id = index === 0 ? 'top' : (index === lastIndex ? 'bottom' : '');
          return (<li className="li-card" key={item.key} style={{top}} ref={refVal} id={id}>{item.value}</li>);
        })}
      </ul>
    );
  }
}

export default SlidingWindowScroll;
