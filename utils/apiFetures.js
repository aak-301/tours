class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1b) ADVANCD FILTERING
    /*
       QREQ.QUERY WHEN WE WANT DURATION>=5
       {difficulty:'easy', duration:{gte:5}}
       {difficulty:'easy', duration:{$gte:5}} // ->MONGO QUERY(The only differene is $)
      */

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    /*
        a> for ascending simply add that field
        and for descending add - in front of that field
        E.g.:sort=-price
  
        b> Inorder to sort on the basis of two fields in mongoose
        We do: sort('price ratingsAverage');
        And the query is like: sort=prie,ratingsAverage
      */
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-_id');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }
  paginate() {
    /*
        Query=page=2&limit=5
        1-10 page1, 11-20 page2
      */
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
