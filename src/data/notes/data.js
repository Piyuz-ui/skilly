// Data & AI paths: Data Analyst, ML Engineer, AI Engineer, Data Engineer.
// Format: see software-a.js.

export default {
  'data-analyst': {
    excel: {
      w: [
        ['Formulas and clean tables', ['Relative vs absolute references ($A$1)', 'SUM, AVERAGE, COUNTIFS, SUMIFS, IF', 'Text and date functions: LEFT, TRIM, TEXT, DATE', 'Tidy data: one row per record, one column per field'], ['Clean a messy sales sheet (duplicates, spaces, dates)', 'Build a summary using SUMIFS by region and month']],
        ['Analysis in Excel', ['PivotTables and slicers', 'XLOOKUP (or VLOOKUP/INDEX-MATCH)', 'Charts: one question per chart', 'Power Query for repeatable cleaning'], ['Build a monthly sales summary with a PivotTable, one lookup and one chart', 'Refresh it with new data using Power Query']],
      ],
      k: [['Absolute reference', '$ locks a row or column when copying a formula.'], ['PivotTable', 'Summarises data by groups without formulas.'], ['XLOOKUP', 'Finds a value in one column and returns a match from another.'], ['Tidy data', 'Each variable a column, each observation a row.']],
      m: ['Merged cells in data tables', 'Hard-coded numbers inside formulas', 'Charts with too many series'],
      q: ['When do you use $ in a formula?', 'XLOOKUP vs VLOOKUP: one advantage?', 'What question does each of your charts answer?'],
    },
    sql: {
      w: [
        ['Querying data', ['SELECT, WHERE, ORDER BY, LIMIT', 'Aggregates: COUNT, SUM, AVG with GROUP BY', 'HAVING vs WHERE', 'NULL handling: IS NULL, COALESCE'], ['Answer 20 business questions on a sample sales database', 'Find top 5 products by revenue per month']],
        ['Joining and analysing', ['INNER and LEFT JOIN', 'CASE WHEN for categories', 'Subqueries and CTEs (WITH)', 'Window functions: ROW_NUMBER, RANK, running totals'], ['Calculate month-over-month growth with a window function', 'Build a customer retention query']],
      ],
      k: [['GROUP BY', 'Collapses rows into groups for aggregates.'], ['LEFT JOIN', 'Keeps all left rows, filling missing matches with NULL.'], ['CTE', 'A named temporary result (WITH) that makes queries readable.'], ['Window function', 'Calculates across related rows without collapsing them.']],
      m: ['Using WHERE to filter aggregates', 'Duplicated rows from joins on non-unique keys', 'Forgetting NULLs in COUNT(column)'],
      q: ['COUNT(*) vs COUNT(column)?', 'How do you get the top product per category?', 'Why might a JOIN multiply row counts?'],
    },
    python: {
      w: [
        ['Python and pandas basics', ['Python: lists, dicts, functions, loops', 'pandas DataFrame: read_csv, head, info, describe', 'Selecting, filtering, sorting', 'Missing values and types'], ['Load a Kaggle dataset and write 10 questions about it', 'Clean missing values and fix column types']],
        ['Analysis and charts', ['groupby and aggregations', 'merge (joins) and pivot_table', 'Dates and resampling', 'Charts with matplotlib/seaborn'], ['Answer your 10 questions with code and charts in a notebook', 'Write a short summary of findings at the top']],
      ],
      k: [['DataFrame', 'A table in pandas with labelled rows and columns.'], ['groupby', 'Split–apply–combine for summaries.'], ['merge', 'pandas version of SQL JOIN.'], ['Notebook', 'Code, output and notes in one document.']],
      m: ['Looping over rows instead of vectorised operations', 'Not checking dtypes after loading', 'Notebooks that only run in a certain order'],
      q: ['How do you find missing values per column?', 'groupby then agg: give an example.', 'Why avoid iterrows for big data?'],
    },
    statistics: {
      w: [
        ['Describing data', ['Mean, median, mode; when median is better', 'Spread: range, IQR, standard deviation', 'Distributions and outliers', 'Correlation vs causation'], ['Summarise 3 columns with the right measures', 'Find and explain outliers with box plots']],
        ['Making decisions', ['Sampling and confidence intervals', 'Hypothesis tests and p-values (plain-English meaning)', 'A/B testing basics', 'Simple linear regression'], ['Analyse a sample A/B test and write a recommendation', 'Fit a regression and explain the slope']],
      ],
      k: [['Median', 'The middle value; robust to outliers.'], ['Standard deviation', 'Typical distance of values from the mean.'], ['p-value', 'How surprising the data would be if there were no real effect.'], ['Confidence interval', 'A range likely to contain the true value.']],
      m: ['Calling correlation causation', 'Reading p < 0.05 as “definitely true”', 'Using the mean for skewed data like salaries'],
      q: ['When is median better than mean?', 'Explain a p-value to a manager.', 'What makes an A/B test fair?'],
    },
    powerbi: {
      w: [
        ['Data model', ['Power Query: load and clean', 'Star schema: fact and dimension tables', 'Relationships and cardinality', 'DAX basics: SUM, CALCULATE, measures vs columns'], ['Model sales data as a star schema', 'Write 5 DAX measures (revenue, growth, margin)']],
        ['Dashboards that answer questions', ['Choosing visuals', 'Slicers and drill-through', 'Layout and storytelling', 'Publishing and refresh'], ['Build a one-page dashboard answering 3 business questions', 'Ask someone to use it without help and fix confusion']],
      ],
      k: [['Star schema', 'A central fact table linked to dimension tables.'], ['Measure', 'A DAX calculation evaluated in the current filter context.'], ['CALCULATE', 'Changes the filter context of a calculation.'], ['Drill-through', 'Click to see details behind a number.']],
      m: ['One giant flat table', 'Calculated columns where measures are needed', 'Dashboards with 15 visuals and no message'],
      q: ['Measure vs calculated column?', 'Why use a star schema?', 'What 3 questions does your dashboard answer?'],
    },
    capstone: {
      w: [
        ['End-to-end project', ['Pick a real dataset and one business question', 'Clean with SQL or Python', 'Analyse with statistics', 'Visualise in Power BI or Python'], ['Complete the analysis in a notebook or dashboard', 'Write 3 recommendations backed by numbers']],
        ['Present it', ['Executive summary: answer first', 'Explaining limitations honestly', 'GitHub README and portfolio page', 'Mock interview walk-through'], ['Publish the project with a README and screenshots', 'Present it in 5 minutes to a friend']],
      ],
      k: [['Business question', 'A decision the analysis should inform.'], ['Executive summary', 'Key findings in 3–5 lines at the top.'], ['Limitation', 'What the data cannot tell you.'], ['Reproducibility', 'Someone else can rerun your work.']],
      m: ['Charts without conclusions', 'Hiding data problems', 'No README'],
      q: ['What decision does your project help make?', 'What is the biggest limitation of your data?', 'Can someone rerun it in 10 minutes?'],
    },
  },

  'ml-engineer': {
    python: {
      w: [
        ['Python for ML', ['Functions, classes, comprehensions', 'Virtual environments and pip', 'NumPy arrays: shape, dtype, indexing', 'Vectorisation and broadcasting'], ['Implement mean, std and normalisation with NumPy only', 'Rewrite a loop-based function in vectorised NumPy']],
        ['Data handling', ['pandas for loading and cleaning', 'Matplotlib for quick plots', 'Train/test splits', 'Writing reusable modules'], ['Clean a dataset and save a processed version', 'Package helper functions as a small module']],
      ],
      k: [['Broadcasting', 'NumPy stretches arrays of compatible shapes automatically.'], ['Vectorisation', 'Operating on whole arrays instead of loops.'], ['Shape', 'Dimensions of an array, e.g. (100, 3).'], ['Virtual environment', 'Isolated packages per project.']],
      m: ['Shape mismatches from confusing rows and columns', 'Global state in notebooks', 'No fixed random seed'],
      q: ['What is the shape of X for 100 samples and 3 features?', 'How does broadcasting add a (3,) array to a (100, 3) array?', 'Why fix random seeds?'],
    },
    stats: {
      w: [
        ['Probability', ['Random variables and distributions (normal, binomial)', 'Expectation and variance', 'Conditional probability and Bayes’ rule', 'Law of large numbers'], ['Simulate coin flips and plot convergence', 'Solve 10 Bayes’ rule problems']],
        ['Statistics for ML', ['Sampling and bias', 'Maximum likelihood intuition', 'Bias–variance trade-off', 'Evaluating with confidence intervals'], ['Bootstrap a confidence interval for model accuracy', 'Explain bias vs variance with a plot']],
      ],
      k: [['Bayes’ rule', 'Updates beliefs with evidence: P(A|B) = P(B|A)P(A)/P(B).'], ['Variance', 'How spread out values are.'], ['Maximum likelihood', 'Pick parameters that make observed data most probable.'], ['Bias–variance', 'Too simple underfits; too complex overfits.']],
      m: ['Ignoring base rates', 'Treating accuracy on one split as exact', 'Assuming everything is normally distributed'],
      q: ['A test is 99% accurate for a rare disease. Why can a positive result still be likely false?', 'What does high variance look like?', 'What is bootstrapping?'],
    },
    sql: {
      w: [
        ['Querying for features', ['Joins, GROUP BY, CASE', 'Window functions for time-based features', 'Date handling', 'Avoiding leakage in time-based data'], ['Build a user-level feature table from event data', 'Compute 7-day rolling counts with window functions']],
        ['Data pipelines', ['Reading SQL from Python', 'Data quality checks', 'Sampling large tables', 'Versioning datasets'], ['Write a script that pulls features and validates them', 'Save a versioned training dataset']],
      ],
      k: [['Feature', 'An input variable for a model.'], ['Data leakage', 'Training data contains information from the future or the label.'], ['Window function', 'Computes values over related rows, like rolling counts.'], ['Data validation', 'Checks for ranges, nulls and duplicates.']],
      m: ['Using future data in features', 'No checks for duplicates', 'Pulling full tables into memory'],
      q: ['Give an example of leakage in churn prediction.', 'How do you compute a 7-day rolling count?', 'What checks do you run on new data?'],
    },
    ml: {
      w: [
        ['Supervised learning', ['Regression vs classification', 'Linear/logistic regression, decision trees, random forests, gradient boosting', 'Train/validation/test and cross-validation', 'Metrics: MAE/RMSE, accuracy, precision, recall, F1, ROC-AUC'], ['Train 3 models on a tabular dataset with scikit-learn', 'Compare them with cross-validation']],
        ['Making models better', ['Feature engineering and scaling', 'Hyperparameter tuning', 'Class imbalance', 'Pipelines to avoid leakage'], ['Build a scikit-learn Pipeline with preprocessing + model', 'Tune it and report test-set results once']],
      ],
      k: [['Overfitting', 'Great on training data, poor on new data.'], ['Cross-validation', 'Rotating validation folds for a reliable score.'], ['Precision vs recall', 'Correct positives vs found positives.'], ['Pipeline', 'Chains preprocessing and model so they are fit together.']],
      m: ['Tuning on the test set', 'Accuracy on imbalanced data', 'Scaling before splitting'],
      q: ['When is recall more important than precision?', 'Why fit the scaler only on training data?', 'What does cross-validation protect against?'],
    },
    git: {
      w: [
        ['Reproducible projects', ['Git for code; .gitignore for data and models', 'requirements.txt or pyproject with pinned versions', 'Config files instead of hard-coded parameters', 'Random seeds'], ['Restructure a notebook project into src/ modules', 'Make it run from one command']],
        ['Experiment tracking', ['Logging params and metrics (MLflow or similar)', 'Data/model versioning (DVC) basics', 'Testing data and code', 'CI for ML projects'], ['Track 5 experiments with MLflow', 'Add a CI job that runs tests and a tiny training run']],
      ],
      k: [['Reproducibility', 'Anyone can rerun and get the same results.'], ['Experiment tracking', 'Recording settings and results for every run.'], ['Pinned versions', 'Exact package versions in requirements.'], ['DVC', 'Git-like versioning for data and models.']],
      m: ['Committing large datasets to Git', '“Final_v3_really_final.ipynb”', 'Untracked experiments'],
      q: ['How would someone reproduce your best model?', 'What should not go into Git?', 'Why track failed experiments too?'],
    },
    capstone: {
      w: [
        ['Serve a model', ['Saving models (joblib, ONNX)', 'Building a prediction API with FastAPI', 'Input validation with schemas', 'Docker for the API'], ['Wrap your model in a FastAPI app with a /predict endpoint', 'Containerise and run it']],
        ['Ship and monitor', ['Deploying to a cloud platform', 'Logging predictions', 'Data drift and retraining', 'A simple demo UI'], ['Deploy publicly with a demo page', 'Write a README covering data, model, metrics and limits']],
      ],
      k: [['Model serving', 'Making a model available for predictions via an API.'], ['Schema validation', 'Rejects bad inputs before the model sees them.'], ['Data drift', 'Live data changes from training data.'], ['Model card', 'Documents what a model does, its data and limits.']],
      m: ['No input validation', 'Different preprocessing in training and serving', 'No monitoring after deployment'],
      q: ['How do you keep preprocessing identical in serving?', 'What signals data drift?', 'What goes in a model card?'],
    },
  },

  'ai-engineer': {
    python: {
      w: [
        ['Python foundations', ['Syntax, data types, functions, classes', 'Files, JSON and APIs (requests)', 'Virtual environments and packages', 'Error handling'], ['Write a script that calls a public API and saves JSON', 'Build a small class-based CLI app']],
        ['Python for AI work', ['NumPy and pandas basics', 'Async basics (asyncio) for many API calls', 'Typing and dataclasses/Pydantic', 'Notebooks vs scripts'], ['Process a CSV with pandas and summarise it', 'Validate API responses with Pydantic models']],
      ],
      k: [['Pydantic', 'Validates data against typed models.'], ['asyncio', 'Runs many I/O tasks concurrently.'], ['requests', 'A simple HTTP client library.'], ['Type hints', 'Document and check expected types.']],
      m: ['Ignoring errors from APIs', 'Everything in one notebook', 'No virtual environment'],
      q: ['Why validate LLM or API output with a schema?', 'When does async help?', 'What does a type hint do at runtime?'],
    },
    sql: {
      w: [
        ['SQL essentials', ['SELECT, WHERE, GROUP BY, JOIN', 'Aggregates and CASE', 'CTEs and window functions', 'Indexes basics'], ['Answer 20 questions on a sample database', 'Write 3 window-function queries']],
        ['Data for AI apps', ['Storing chat logs and documents', 'Full-text search basics', 'Vector columns (e.g. pgvector) at a high level', 'Querying from Python'], ['Store and query a document table from Python', 'Try a similarity search with pgvector or a local alternative']],
      ],
      k: [['JOIN', 'Combines related tables.'], ['CTE', 'A readable named subquery.'], ['Full-text search', 'Keyword search inside text columns.'], ['Vector search', 'Finds items with similar embeddings.']],
      m: ['String-built queries (injection)', 'No indexes on lookup columns', 'Storing everything as one JSON blob'],
      q: ['Keyword search vs vector search?', 'How do you prevent SQL injection from Python?', 'When would you add an index?'],
    },
    stats: {
      w: [
        ['Exploring data', ['Descriptive statistics', 'Distributions and outliers', 'Correlation', 'Visualisation for EDA'], ['Do a full EDA on a Kaggle dataset', 'Write 5 insights with charts']],
        ['Probability for ML', ['Conditional probability and Bayes', 'Sampling and bias', 'Evaluation uncertainty', 'Basics of A/B testing'], ['Bootstrap the uncertainty of a metric', 'Design an A/B test for a chatbot feature']],
      ],
      k: [['EDA', 'Exploratory data analysis: understand data before modelling.'], ['Outlier', 'A value far from the rest.'], ['Bias in data', 'Data that does not represent the real population.'], ['A/B test', 'Comparing two versions with randomised users.']],
      m: ['Skipping EDA', 'Trusting averages of skewed data', 'Over-reading tiny samples'],
      q: ['What do you check first in a new dataset?', 'How could biased data affect an AI assistant?', 'How many users does an A/B test need?'],
    },
    ml: {
      w: [
        ['Classic ML', ['Supervised vs unsupervised learning', 'Regression, classification, clustering', 'Train/validation/test and cross-validation', 'Metrics and overfitting'], ['Train and compare 3 scikit-learn models', 'Explain your best model’s mistakes']],
        ['Practical ML', ['Feature engineering', 'Pipelines', 'Imbalanced data', 'Model interpretation basics'], ['Build a full scikit-learn pipeline', 'Write up results and limitations']],
      ],
      k: [['Supervised learning', 'Learning from labelled examples.'], ['Clustering', 'Grouping similar items without labels.'], ['Overfitting', 'Memorising training data instead of generalising.'], ['Feature importance', 'Which inputs most affect predictions.']],
      m: ['Evaluating on training data', 'Leakage through preprocessing', 'Accuracy on imbalanced classes'],
      q: ['How do you detect overfitting?', 'Give a use for clustering.', 'Which metric for fraud detection and why?'],
    },
    dl: {
      w: [
        ['Neural networks', ['Neurons, layers, activations', 'Loss functions and gradient descent', 'Backpropagation intuition', 'PyTorch tensors and training loops'], ['Train an MLP on MNIST in PyTorch', 'Plot training and validation loss']],
        ['Modern architectures', ['CNNs for images', 'Embeddings and sequence models', 'Attention and Transformers (high level)', 'Transfer learning and fine-tuning'], ['Fine-tune a small pretrained model (image or text)', 'Compare with training from scratch']],
      ],
      k: [['Gradient descent', 'Adjust weights step by step to reduce loss.'], ['Embedding', 'A vector that captures meaning of an item.'], ['Attention', 'Lets a model focus on relevant parts of the input.'], ['Transfer learning', 'Reuse a pretrained model for a new task.']],
      m: ['Too-high learning rates', 'No validation set', 'Training huge models on a laptop instead of fine-tuning'],
      q: ['What does the learning rate control?', 'Why are Transformers good at language?', 'When is fine-tuning better than training from scratch?'],
    },
    llm: {
      w: [
        ['Working with LLMs', ['Tokens, context windows, temperature', 'Calling an LLM API', 'Prompt structure: role, task, context, format, examples', 'Structured output (JSON) and validation'], ['Build a CLI that summarises articles via an LLM API', 'Return validated JSON with fields you define']],
        ['Reliable LLM apps', ['Few-shot prompting and chain-of-thought style instructions', 'Hallucinations and grounding', 'Evaluation: test sets and graders', 'Cost, latency and safety'], ['Create a 20-example eval set for your app', 'Measure quality and cost of 2 prompt versions']],
      ],
      k: [['Token', 'A chunk of text the model reads and writes.'], ['Context window', 'How much text the model can consider at once.'], ['Temperature', 'Randomness of outputs.'], ['Hallucination', 'Confident but false output.']],
      m: ['No evaluation, just vibes', 'Trusting output without validation', 'Putting API keys in frontend code'],
      q: ['How do you make LLM output machine-readable?', 'How do you measure if a prompt change helped?', 'What reduces hallucinations?'],
    },
    rag: {
      w: [
        ['Retrieval-augmented generation', ['Chunking documents', 'Embeddings and vector databases', 'Retrieve → augment prompt → generate', 'Citations and grounding'], ['Build a Q&A bot over your course notes with citations', 'Test it on 20 questions']],
        ['Agents and tools', ['Tool/function calling', 'Agent loops: plan, act, observe', 'Guardrails, timeouts and human approval', 'Evaluating agents'], ['Build an agent that uses 2 tools (search + calculator)', 'Add limits and logging for every tool call']],
      ],
      k: [['RAG', 'Fetch relevant documents and give them to the model before answering.'], ['Chunking', 'Splitting documents into retrievable pieces.'], ['Tool calling', 'The model requests a function to run and gets the result.'], ['Agent', 'A loop where a model chooses actions toward a goal.']],
      m: ['Chunks too large or too small', 'No citations', 'Agents with unlimited steps or permissions'],
      q: ['Why does RAG reduce hallucinations?', 'How do you choose chunk size?', 'What guardrails should an agent have?'],
    },
    mlops: {
      w: [
        ['Deploying AI apps', ['FastAPI backend for your model/LLM app', 'Docker and environment configuration', 'Secrets management', 'Streaming responses'], ['Deploy your RAG app as a web service', 'Add streaming answers']],
        ['Operating in production', ['Logging prompts, outputs and latency (privacy-aware)', 'Monitoring quality and cost', 'Caching and rate limits', 'Continuous evaluation'], ['Add a dashboard of latency, cost and failures', 'Run your eval set automatically on every change']],
      ],
      k: [['MLOps', 'Practices for deploying and maintaining ML systems.'], ['Observability', 'Seeing what the system does in production.'], ['Caching', 'Reuse answers to save cost and time.'], ['Continuous evaluation', 'Testing quality on every change.']],
      m: ['Logging personal data without consent', 'No cost limits', 'Shipping prompt changes without evals'],
      q: ['What would you log for each LLM call?', 'How do you control monthly cost?', 'What blocks a bad prompt change from shipping?'],
    },
  },

  'data-engineer': {
    sql: {
      w: [
        ['Advanced SQL', ['CTEs and window functions', 'Complex joins and anti-joins', 'Query plans (EXPLAIN)', 'Indexes and partitioning'], ['Optimise 3 slow queries using EXPLAIN', 'Write deduplication with ROW_NUMBER']],
        ['Modelling', ['Normalisation vs denormalisation', 'Star schema: facts and dimensions', 'Slowly changing dimensions (SCD type 2)', 'Data quality constraints'], ['Model an e-commerce warehouse schema', 'Implement an SCD type 2 table']],
      ],
      k: [['EXPLAIN', 'Shows how the database will run a query.'], ['Partitioning', 'Splitting a table by a key (often date) for speed.'], ['Fact table', 'Stores events/measurements.'], ['SCD type 2', 'Keeps history by adding new rows when attributes change.']],
      m: ['SELECT * in pipelines', 'No deduplication strategy', 'Ignoring time zones'],
      q: ['How do you remove duplicates keeping the latest row?', 'Fact vs dimension table?', 'When is partitioning useful?'],
    },
    py: {
      w: [
        ['Python for pipelines', ['Reading/writing CSV, JSON, Parquet', 'pandas and when to avoid it for big data', 'APIs and pagination', 'Logging and retries'], ['Write an ingestion script from a paginated API to Parquet', 'Add retries and logging']],
        ['Engineering quality', ['Packaging and configuration', 'Unit tests for transformations', 'Type hints', 'Idempotent loads'], ['Refactor the script into a tested package', 'Make reruns safe (no duplicates)']],
      ],
      k: [['Parquet', 'Columnar file format: compressed and fast for analytics.'], ['Idempotent load', 'Rerunning gives the same result, no duplicates.'], ['Retry with backoff', 'Retry failed calls with growing waits.'], ['Schema', 'Expected columns and types.']],
      m: ['CSV for everything', 'Pipelines that duplicate data on rerun', 'No tests for transformations'],
      q: ['Why is Parquet better than CSV for analytics?', 'How do you make a load idempotent?', 'What should you log in a pipeline?'],
    },
    batch: {
      w: [
        ['ETL/ELT', ['Extract, transform, load vs ELT', 'Scheduling and dependencies', 'Apache Airflow DAGs', 'Backfills'], ['Build an Airflow DAG that ingests and transforms daily data', 'Run a backfill for the past week']],
        ['Reliable pipelines', ['Data quality tests (e.g. Great Expectations)', 'Alerting on failures', 'Incremental loads', 'Documentation and lineage'], ['Add quality checks that stop bad data', 'Switch a full load to incremental']],
      ],
      k: [['DAG', 'A directed acyclic graph of tasks and dependencies.'], ['Backfill', 'Running a pipeline for past dates.'], ['Incremental load', 'Process only new or changed data.'], ['Lineage', 'Where data came from and how it changed.']],
      m: ['Full reloads every run', 'Silent failures', 'Tasks that depend on hidden state'],
      q: ['ETL vs ELT?', 'How does Airflow know task order?', 'What should happen when a quality check fails?'],
    },
    dwh: {
      w: [
        ['Data warehouses', ['Warehouse concepts: BigQuery, Snowflake, Redshift', 'Columnar storage and cost', 'Loading data', 'Access control'], ['Load your data into a free-tier warehouse', 'Compare query cost with and without filters']],
        ['dbt', ['Models, sources, refs', 'Tests: unique, not_null, relationships', 'Incremental models', 'Docs and lineage graphs'], ['Build a dbt project with staging and mart models', 'Add tests and generate docs']],
      ],
      k: [['Data warehouse', 'A database optimised for analytics queries.'], ['dbt model', 'A SQL select that dbt turns into a table or view.'], ['ref()', 'dbt function that links models and builds lineage.'], ['Mart', 'A business-ready table for analysts.']],
      m: ['Scanning whole tables in pay-per-query warehouses', 'No tests in dbt', 'Business logic scattered across dashboards'],
      q: ['Why does columnar storage reduce cost?', 'What does ref() give you?', 'Staging vs mart model?'],
    },
    spark: {
      w: [
        ['Spark basics', ['Distributed computing: driver, executors, partitions', 'DataFrames in PySpark', 'Transformations vs actions, lazy evaluation', 'Reading/writing Parquet'], ['Process a multi-GB dataset with PySpark locally', 'Inspect the Spark UI']],
        ['Performance', ['Shuffles and joins', 'Partitioning and skew', 'Caching', 'Lakehouse formats (Delta/Iceberg) at a high level'], ['Optimise a slow join with broadcast', 'Fix a skewed key']],
      ],
      k: [['Lazy evaluation', 'Spark builds a plan and runs it only on an action.'], ['Shuffle', 'Moving data between machines; often the slowest step.'], ['Broadcast join', 'Send a small table to all executors to avoid shuffles.'], ['Data skew', 'Some partitions much bigger than others.']],
      m: ['collect() on huge data', 'Too many small files', 'Ignoring skew'],
      q: ['Transformation vs action?', 'When is a broadcast join good?', 'How do you spot skew in the Spark UI?'],
    },
    stream: {
      w: [
        ['Streaming basics', ['Events, topics, partitions, offsets (Kafka)', 'Producers and consumers', 'At-least-once vs exactly-once', 'Event time vs processing time'], ['Run Kafka locally and stream fake orders', 'Consume and print running totals']],
        ['Stream processing', ['Windowing: tumbling, sliding', 'Late data and watermarks', 'Spark Structured Streaming or Flink', 'Sinks to a warehouse'], ['Compute 1-minute revenue windows', 'Write results to a table and chart them']],
      ],
      k: [['Topic', 'A named stream of events in Kafka.'], ['Offset', 'A consumer’s position in a partition.'], ['Watermark', 'How long to wait for late events.'], ['Tumbling window', 'Fixed, non-overlapping time windows.']],
      m: ['Using processing time when event time matters', 'Not handling duplicates', 'Streaming when daily batch is enough'],
      q: ['At-least-once: what problem must consumers handle?', 'Why do watermarks exist?', 'When is batch better than streaming?'],
    },
  },
};
