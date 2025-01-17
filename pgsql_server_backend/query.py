import logging
import time
import psycopg2

def getData():
    # Connect to your postgres DB
    conn = psycopg2.connect("dbname=postgres user=postgres ")

    # Open a cursor to perform database operations
    cur = conn.cursor()

    # Execute a query
    cur.execute("select states, avg(diesel) as diesel from final_gas where date between '2015-01-01' and '2015-05-01' group by states")

    # Retrieve query results
    records = cur.fetchall()

    return records

def getState(): 
    start_time = time.time()
    # Connect to your postgres DB
    conn = psycopg2.connect("dbname=postgres user=postgres ")

    # Open a cursor to perform database operations
    cur = conn.cursor()

    # Execute a query
    cur.execute("select states, avg(diesel) as diesel from final_gas where date between '2015-01-01' and '2015-05-01' group by states")

    # Retrieve query results
    result = cur.fetchall()
    query_time = time.time() - start_time
    logging.info("executed query in {0}".format(query_time))

    return result

def getBetween():
    start_time = time.time()
    # Connect to your postgres DB
    conn = psycopg2.connect("dbname=postgres user=postgres ")

    # Open a cursor to perform database operations
    cur = conn.cursor()
    # query = "select date,states,diesel from final_gas where date between '{0}' and '{1}' ".format(_from,_to)
    # query = "select * from demo1 order by date"
    query = "select date,state,avg from horizon_graph"
    # Execute a query
    cur.execute(query)
    # Retrieve query results
    result = cur.fetchall()
    
    return result

def getHex():
    start_time = time.time()
    # Connect to your postgres DB
    conn = psycopg2.connect("dbname=postgres user=postgres ")

    # Open a cursor to perform database operations
    cur = conn.cursor()
    # query = "select date,states,diesel from final_gas where date between '{0}' and '{1}' ".format(_from,_to)
    query = "select diesel,lat,lng from demo3"
    print(query)
    # Execute a query
    cur.execute(query)
    # Retrieve query results
    result = cur.fetchall()
    
    return result


def getDiesel(year, month, day):
    
    # Connect to your postgres DB
    conn = psycopg2.connect("dbname=postgres user=postgres ")

    # Open a cursor to perform database operations
    cur = conn.cursor()
    # query = "select date,states,diesel from final_gas where date between '{0}' and '{1}' ".format(_from,_to)
    query = "select avg as diesel,lat,lng from (select distinct stid, avg ,lat,lng from perfect where date = '{0}-{1}-{2}') as p".format(year,month,day)
    print(query)
    # Execute a query
    cur.execute(query)
    # Retrieve query results
    result = cur.fetchall()
    
    return result


def linechart(query):
    
    # Connect to your postgres DB
    conn = psycopg2.connect("dbname=postgres user=postgres ")

    # Open a cursor to perform database operations
    cur = conn.cursor()
    # query = "select date,states,diesel from final_gas where date between '{0}' and '{1}' ".format(_from,_to)
    # query = """
    # select avg,date,stid from perfect where lat=51.430709 and lng=8.002618
    # and date between '2015-1-1' and '2015-1-15'
    # union 
    # select avg,date,stid from perfect where lat=51.42032 and lng=8.040306
    # and date between '2015-1-1' and '2015-1-15'
    # union
    # select avg,date,stid from perfect where lat=51.40164 and lng=8.05985
    # and date between '2015-1-1' and '2015-1-15'
    # union
    # select avg,date,stid from perfect where lat=51.4104958 and lng=8.054933
    # and date between '2015-1-1' and '2015-1-15'
    # union
    # select avg,date,stid from perfect where lat=51.4205 and lng=7.9903
    # and date between '2015-1-1' and '2015-1-15' order by date
    # """
    # Execute a query
    cur.execute(query)
    # Retrieve query results
    result = cur.fetchall()
    
    return result

