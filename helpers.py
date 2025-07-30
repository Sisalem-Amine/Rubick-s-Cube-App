def checkValidity(username, password, confirm_password, endpoint, user):
    if not username or ' ' in username:
        return "Invalid username"

    if not password or len(password) < 6:
        return "Invalid password"
    
    if endpoint == "login" and not user:
        return "Username doesn't exist"

    if endpoint == "register":
        if not confirm_password or len(confirm_password) < 6:
            return "Invalid password confirmation"
        if password != confirm_password:
            return "Passwords do not match"
        if user:
            return "Username already exists"

    return None


def queryGenerator(select, sort, order):
    query = "SELECT scramble_type, scramble, time, timestamp FROM solves WHERE user_id = ?"

    selectOptions = ["3x3", "2x2", "pll", "oll"]

    if select in selectOptions:
        query += f" AND scramble_type = '{select}'"

    sortOptions = ["time_ms", "timestamp"]
    orderOptions = ["ASC", "DESC"]

    if sort in sortOptions and order in orderOptions:
        query += f" ORDER BY {sort} {order}"

    return query  
    
