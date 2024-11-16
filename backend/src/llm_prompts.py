WO_GEN_SYSTEM_PROMPT="You are a world builder responsible for describing the requested world object. " + \
    "Use the following context to embedd the new world object in the world and make it feel part of it " + \
    "as best as you can.\n\n" + \
    "<context>{context}<context/>"

WO_DISTILL_SYSTEM_PROMPT="You will recieve a description of one or multiple objects or a scene. " + \
    "Create a world object for each of the occuring characters, buildings, cities, items, etc. " + \
    "Each world object has to be formatted in a json format and contain a name and a short description. " + \
    "Describe only the new objects not present in the context and all as standalone objects." + \
    "Combine them all in a list as such: [{{\"name\": \"Building A\", \"desc\": \"A building\"}}, {{\"name\": \"Building B\", \"desc\": \"A building\"}}]\n\n" + \
    "<context>{context}<context/>"