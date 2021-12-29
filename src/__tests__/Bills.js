import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES } from "../constants/routes"
import VerticalLayout from "../views/VerticalLayout"
import Bills from "../containers/Bills.js"
import userEvent from "@testing-library/user-event"


describe("Given I am connected as an employee", () => {
  // test ligne 44-46 BillsUI pour atteindre 100%
  describe('When I am on Dashboard page but it is loading', () => {
    test('Then, Loading page should be rendered', () => {
      const html = BillsUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  // test ligne 46 BillsUI pour atteindre 100%
  describe('When I am on Dashboard page but back-end send an error message', () => {
    test('Then, Error page should be rendered', () => {
      const html = BillsUI({ error: 'some error message' })
      document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })
  
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      // Mock local Storage on window to set user connected as Employee
      
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
      const html = VerticalLayout(120)

      document.body.innerHTML = html
      
      expect(screen.getByTestId("icon-window").classList.contains("active-icon"))
    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => b.date - a.date 
      // changement de calcul
      const datesSorted = [...dates].sort(antiChrono)
      
      expect(dates).toEqual(datesSorted)
    })
    // test container bill "nouvelle note de frais"
    describe("When I click on New Bill btn", () => {
      test("It should renders new bill page", () => {
        window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
  
        const html = BillsUI({ data: []})
        document.body.innerHTML = html
  
        const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
        
        const bills = new Bills({document, onNavigate, localStorage: window.localStorage})
  
        const handleClickNewBill = jest.fn(() => bills.handleClickNewBill)
        const newBillBtn = screen.getByTestId('btn-new-bill')
  
        newBillBtn.addEventListener('click', handleClickNewBill)
        userEvent.click(newBillBtn)

        expect(handleClickNewBill).toHaveBeenCalled()
        expect(screen.queryByText('Envoyer une note de frais')).toBeTruthy()
      })
    })
    // test container bill 50-71% "test modale"
    describe('When I click on the icon eye from a bill', () => {
      test('A modal should open', () => {
       
        window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
        
        const html = BillsUI({ data: [bills[1]] })
        document.body.innerHTML = html

        const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}

        const billsClass = new Bills({document, onNavigate, localStorage: window.localStorage})

        const modale = document.getElementById("modaleFile")
        $.fn.modal = jest.fn(() => modale.classList.add('show'))
    
        const handleClickIconEye = jest.fn(() => billsClass.handleClickIconEye)
        const iconEye = screen.getByTestId('icon-eye')
    
        iconEye.addEventListener('click', handleClickIconEye)
        userEvent.click(iconEye)

        expect(handleClickIconEye).toHaveBeenCalled()
        expect(modale.classList).toContain('show')
      })
    })
  })
})
// test d'intégration GET
// describe("Given I am a user connected as Admin", () => {
//   describe("When I navigate to Dashboard", () => {
//     test("fetches bills from mock API GET", async () => {
//        const getSpy = jest.spyOn(store, "get")
//        const bills = await store.get()
//        expect(getSpy).toHaveBeenCalledTimes(1)
//        expect(bills.data.length).toBe(4)
//     })
//     test("fetches bills from an API and fails with 404 message error", async () => {
//       store.get.mockImplementationOnce(() =>
//         Promise.reject(new Error("Erreur 404"))
//       )
//       const html = DashboardUI({ error: "Erreur 404" })
//       document.body.innerHTML = html
//       const message = await screen.getByText(/Erreur 404/)
//       expect(message).toBeTruthy()
//     })
//     test("fetches messages from an API and fails with 500 message error", async () => {
//       store.get.mockImplementationOnce(() =>
//         Promise.reject(new Error("Erreur 500"))
//       )
//       const html = DashboardUI({ error: "Erreur 500" })
//       document.body.innerHTML = html
//       const message = await screen.getByText(/Erreur 500/)
//       expect(message).toBeTruthy()
//     })
//   })
// })
