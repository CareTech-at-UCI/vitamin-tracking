Rohan's Final Model Training Notes

Performed dataset ablation on V2 on the bottom 15% of each class in terms of quality aka laplacian variance (Link to new dataset creation: https://colab.research.google.com/drive/1R1bQTN40hVIm6bjtMkoiA8axoeyY_7ga?usp=sharing).

The new dataset has been uploaded to the CareTech workspace in Roboflow which is already shared with everybody and is under the project id 'final_training_w_v2_ablation'.

Unfortunately, I was only able to undergo one model training as I ran out of credits (the one model I did trained went 10 credits over my plan limit, using 25 out of 15 credits).

Here are the details for the model:
YOLO26x (Extra Large model -- the largest out of all available)
Dataset ablation - removed 15% of the lowest quality images from each class
Preprocessing - Auto-orient, 640x640 resizing
Augmentations - None
Results - mAP@50 77.3%, Precision 79.4%, Recall 70.1%

I honestly wasn't too impressed with this model. I feel that I've been able to obtain similar results with the lighter v11, v26 versions, and using an XL model didn't make it as accurate as I thought it would. I did run out of credits and it seemed like the model was continuing to progress, however, which makes any evaluations I give a bit inaccurate. I know there's not much more time, and credits are dwindling, but I would love to fully train a huge model like this one and see how good it can actually get.
