import { Request, Response, Router } from "express";
import Usage from "../models/Usage";
import axios from "axios";

const router: Router = Router();

router.post('/usage', async (req: Request, res: Response) => {
    const startOfUse = req.body.start; // vaja sisestada kujul: "2023-03-14T02:40"
    const endOfUse = req.body.end; // vaja sisestada kujul: "2023-03-14T08:35"
    const kpv1 = new Date(startOfUse);
    const kpv2 = new Date(endOfUse);

    const response = await axios.get( //  Elering väljastab iga täistunni kohta ühe maksumuse, seega start peab olema 00 minutiga.
        "https://dashboard.elering.ee/api/nps/price?start="+startOfUse.split(":")[0]+":00:00.000Z&end="+endOfUse+":00.000Z"
    );

    let sum = 0;
    const prices = response.data.data.ee.slice(); // kasutame vaid Eesti aegasid

    if (prices.length === 1) { // kui on tegemist sama tunniga, erinevad vaid minutid
        const cost = prices[0].price * (kpv2.getMinutes() - kpv1.getMinutes()) / 60;
        sum += cost;
    }

    if (prices.length > 1) { // kui on tegemist kahe või rohkema erineva tunniga
        // arvutame kokku esimese ja viimase tunni maksumused vastavalt tunnis tarbitud minutitele
        const costFirstHour = prices[0].price * (60-kpv1.getMinutes()) / 60;
        sum += costFirstHour;
        const costLastHour = prices[prices.length-1].price * (kpv2.getMinutes()) / 60;
        sum += costLastHour;
    }

    if (prices.length > 2) {
        prices.splice(0,1); // võtame esimese hinna ära, kuna see on juba liidetud kogusummale
        prices.splice(prices.length-1); // võtame viimase hinna ära, kuna see on juba liidetud kogusummale
        prices.forEach((element: any) => sum += element.price);
        // saame kõik hinnad kokku liita, sest tegemist on alati täistunniga ühe kasutuskorra puhul
    }

    // console.log(sum); <-- summa, kui kulutaksime 1 000 000 wati ehk 1 megawati jagu elektrit selles vahemikus
    const totalUsageCost = sum / 1000000 * req.body.watts;
    // jagame megawati miljoniga, et saada watid ning seejärel korrutame tarbitud wattidega

    res.json("Sinu kulu selles vahemikus oli: " + totalUsageCost + " eurot.");


//   const data = new Usage({
//       device: req.body.device,
//       customer: req.body.customer,
//       startDate: req.body.start,
//       endDate: req.body.end,
//       totalUsageCost: req.body.totalUsageCost
//   })

//   try {
//     const dataToSave = await data.save();
//     res.status(200).json(dataToSave)
//   }
//   catch (error) {
//     res.status(400).json({message: error})
//   }
})

// ülejäänud API otspunktides asuv kood on muutumatu...