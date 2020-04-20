import shapefile
import csv
import json
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

sf = shapefile.Reader("../src/assets/shapes/BARI/Tracts_Boston BARI.shp")

print(sf)

shapes = sf.shapeRecords()
print(sf.fields)
result = []

for s in shapes:
    polygon = Polygon(s.shape.points)
    count = 0
    print("Parsing ID ", s.record['CT_ID_10'])
    with open('Trees.csv', newline='', encoding='utf-8-sig') as treefile:
        trees = csv.DictReader(treefile)
        for row in trees:
            point = Point(float(row['X']), float(row['Y']))
            
            if (polygon.contains(point)):
                count += 1
    print("Number of trees: ", count)
    result.append({'CT_ID_10': s.record['CT_ID_10'], 'tree_num': count})

# Source for this snippet: https://stackabuse.com/reading-and-writing-json-to-a-file-in-python/
with open('trees_count.json', 'w') as outfile:
    json.dump(result, outfile)