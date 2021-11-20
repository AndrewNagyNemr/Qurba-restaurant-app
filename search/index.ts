require("dotenv").config({ path: "./.env" });
import elasticsearch from "elasticsearch";
import express from "express";
import cors from "cors";

const { PORT, ELASTIC_URL } = process.env;
const app = express();
if (!ELASTIC_URL || !PORT)
  throw Error("Please provide MONGO_URL and PORT to the env");

const esClient = new elasticsearch.Client({
  host: ELASTIC_URL,
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.use(cors());
app.use(express.json());

app.post("/search", async (req, res) => {
  const { search, index } = req.body;
  if (!index)
    return res.status(401).json({ error: "you must provide index and search" });

  const body = search
    ? {
        query: {
          match: search,
        },
      }
    : null;
  try {
    const result = await esClient.search({
      index: index as string,
      body,
    });
    res.json(result);
  } catch (error) {
    res.json([]);
  }
});

app.post("/index", async (req, res) => {
  const { body, index, type } = req.body;
  try {
    const result = await esClient.index({
      index,
      body,
      type,
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async (req, res) => {
  const { index, type, id } = req.body;
  try {
    const result = await esClient.deleteByQuery({
      index,
      type,
      body: {
        query: {
          match: {
            id,
          },
        },
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

app.patch("/delete", async (req, res) => {
  const { index, type, id } = req.body;
  try {
    const result = await esClient.deleteByQuery({
      index,
      type,
      body: {
        query: {
          match: {
            id,
          },
        },
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});
