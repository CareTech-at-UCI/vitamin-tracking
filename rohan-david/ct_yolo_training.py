# script for running on configured environments
from dotenv import load_dotenv
from roboflow import Roboflow
import os
import wandb
from wandb.integration.ultralytics import add_wandb_callback
import ultralytics
from ultralytics.models import YOLO
load_dotenv()

ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")
WANDB_API_KEY = os.getenv("WANDB_API_KEY")


rf = Roboflow(api_key=ROBOFLOW_API_KEY)
project = rf.workspace("caretech-qnw0y").project("v1-caretech-combined-dataset")
dataset = project.version(1).download("yolov8")

wandb.login(key=WANDB_API_KEY)

wandb.init(
    entity="caretech",
    # rename this to what u want the run to be named
    project="david",
    name=f"run1",
)

# remember to fix dataset name 
# mv "/content/[V1]-CareTech-Combined-Dataset-1" "/content/V1-CareTech-Combined-Dataset-1"

# this is a list of hyperparameters we should be tuning
#
#    mandatory hyperparameters to note:
#    Number of epochs
#    Learning rate
#    Batch size
#    mAP on validation set
#    YOLO filters (if any were used)
#
# i think we should tune
# batch size ("batch" int or float)
# learning rate ("lr0" and "lrf" float)
# momentum ("momentum" float)
# weight decay ("weight_decay" float)
# number of epochs ("epochs" int)
# documenation
# https://docs.ultralytics.com/modes/train/#train-settings

model = YOLO("yolo26m.pt")
add_wandb_callback(model, enable_model_checkpointing=True) # this saves weights to colab


# Train the model
results = model.train(
    # these are the hyperparameters
    # setting optimizer as auto overrides set hyperparameters
    data="/content/V1-CareTech-Combined-Dataset-1/data.yaml",
    epochs=100,
    imgsz=640,
    batch=0.8,
    patience=50,
    cache=True,
    device=0,
)