const Search = () => {
  return (
    <form action="#">
      <div className="form-group">
        <input type="text" placeholder="Enter your Search Content" required />
        <div className="btn-border">
          <button className="cmn-btn">Search</button>
        </div>
      </div>
    </form>
  );
};

export default Search;
