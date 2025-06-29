from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

db_username = "root"
db_password = ")Q9w8e7r6t5y4u3i2o1p"
db_ip = "localhost"
db_name = 'curriculumchecklist'

db_connection = create_engine("mysql+mysqlconnector://{0}:{1}@{2}/{3}".format(db_username, db_password, db_ip, db_name))
local_session = sessionmaker(db_connection)

def get_db():
    db = local_session()
    try:
        yield db
    finally:
        db.close()
