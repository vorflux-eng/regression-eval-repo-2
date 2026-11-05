# F9: unpinned base tag, root user, no healthcheck.
FROM python:3.11

WORKDIR /srv
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["python", "-m", "app.main"]
