# Pull Asheville App requests into database

Calls PublicStuff API:
https://api.publicstuff.com/api/index.html?url=/api/api-docs.json

### Filter just Asheville data
&filters[client_id]=819


First version just runs once and pulls everything.

Field wishlist:
- "properties"	
    - "id"	
    - "name"	
    - "description"	
    - "created_at"	
    - "permissions"	
    - "status"	
    - "priority"	
    - "is_duplicate"	FALSE 
    - "responded_at"	
    - "geo_location_id"	cod
    - "primary_attachment"	
    - "request_type_name"	


    - "geo_location"
        - "latitude"
        - "longitude"
        - "name"

    - "primary_attachment"
        - "file_ref"
            - "url"

