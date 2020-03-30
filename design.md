## Handling Different Data Sources

- For every way we want to represent data, there should be a component that defines this
    - Each of these components should query their own data
    - For example, displaying MBTA stops. There will be an `<MBTAStops />` component that will:
        - Run a GraphQL query to get the locations of every stop
        - Appropriately use other Leaflet components to display it (in this case, likely a Marker)
- To display this with MDX (if this is not too time-intensive), MDX should use map components with appropriate overlays

## Questions to Answer
- How are we figuring out what census tracts have more access to `x`?
    - For example -- T stops. We need to do some location math (maybe there is already some pre-built GeoJSON math to do this) that will determine if a point is in a polygon
    - Doing this math is going to be the hardest part, and we should make sure to chunk out a lot of time for it, even though we're a week away from this being due.
    - Math questions to answer:
        - Is a coordinate within a polygon?
        - How far are the closest points to an average point on a polygon?
        - How large is a polygon?
    - *There are likely some libraries that will do this work for us*

## Work Plan
- [ ] Complete work on the tract display data by end of day on Tuesday (3/31)
    - [ ] Determine how to handle popup formatting -- could it use a custom component here? Where would it source the data?
- [ ] Complete work on MBTA visualization by end of day on Monday (3/30)
    - [ ] Mark stop markers with their appropriate color
- [ ] Final Report by Sunday (4/5)
    - [ ] Post this report on the "write-up" page of the website